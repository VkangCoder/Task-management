const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const argon2 = require("argon2");
const {
  BadRequestError,
  ConflictRequestError,
} = require("../../../core/error.response");
const {
  SignAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../services/jwt_service");
const {
  validateRefRole,
  validateRefDepartment,
} = require("../../../middleware/validate/validateReferencer");
const { uploadFileToStorage } = require("../../../utils/storagaeUtils");

module.exports = {
  RegisterUserService: async (user, UserId, file) => {
    if (!file) {
      throw new BadRequestError("No file uploaded.");
    }
    const departmentID = parseInt(user.department_id);
    const roleID = parseInt(user.role_id);
    //validate ref role
    await validateRefRole(roleID);
    //validate ref department
    await validateRefDepartment(departmentID);
    //Check email có tồn tại trước chưa nếu trùng ko cho tạo mới
    const holderUser = await prisma.users.findMany({
      where: {
        email: user.email,
      },
    });
    // Sửa ở đây: kiểm tra nếu mảng holderUser không rỗng
    if (holderUser.length > 0) {
      throw new ConflictRequestError("Error: User already registered!");
    }
    //hash password
    const passwordHash = await argon2.hash(user.password, 10);
    //Tạo user
    const imageUrl = await uploadFileToStorage(
      file,
      "image/" + file.originalname
    );
    console.log(imageUrl);
    // if (!imageUrl) throw new BadRequestError("Ko upload ảnh được");

    const newUser = await prisma.users.create({
      data: {
        fullname: user.fullname,
        email: user.email,
        password: passwordHash,
        //Ví dụ upload ảnh ở đây
        user_img: imageUrl,
        // franchies_id: user.franchies_id,
        department_id: departmentID,
        role_id: roleID,
        status: true,
        created_by: UserId,
      },
    });
    if (!newUser) throw BadRequestError("Có lỗi trong việc thêm 1 user");
    return newUser;
  },
  LoginUserService: async (user) => {
    const foundUser = await prisma.users.findFirst({
      where: {
        email: user.email,
      },
      include: {
        roles_users_role_idToroles: true,
      },
    });

    if (!foundUser) {
      throw new BadRequestError("User have not registered");
    }

    // Kiểm tra mật khẩu
    const isValid = await argon2.verify(foundUser.password, user.password);
    if (!isValid) {
      throw new BadRequestError("Invalid password");
    }
    const parent_role_id = foundUser.roles_users_role_idToroles.parent_role_id;

    // Giả sử bạn có hàm SignAccessToken và signRefreshToken để tạo các token
    const accessToken = await SignAccessToken(
      foundUser.id,
      foundUser.role_id,
      parent_role_id
    );

    const refreshToken = await signRefreshToken(foundUser.id);
    const userName = foundUser.fullname;
    const user_img = foundUser.user_img;
    const roleName = foundUser.roles_users_role_idToroles.role_name;

    return {
      roleName,
      userName,
      user_img,
      accessToken,
      refreshToken,
    };
  },
  refreshTokenService: async (refreshToken) => {
    if (!refreshToken) {
      throw new BadRequestError("Refresh Token ko hợp lệ hoặc ko có");
    }

    const userData = await verifyRefreshToken(refreshToken);
    const accessToken = await SignAccessToken(userData.id, userData.role_id);

    // (Tùy chọn) Phát hành một refresh token mới và lưu trữ nó
    // const newRefreshToken = await signRefreshToken(userData.userId);
    // Lưu trữ vào Redis ở đây
    if (!accessToken) {
      throw new BadRequestError("");
    }
    return {
      accessToken,
      // Trả về refreshToken mới nếu cần
    };
  },
};
