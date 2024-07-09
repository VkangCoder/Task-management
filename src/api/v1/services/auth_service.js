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
module.exports = {
  RegisterUserService: async (user, UserId) => {
    //validate ref role
    await validateRefRole(user.role_id);
    //validate ref department
    await validateRefDepartment(user.department_id);
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
    const newUser = await prisma.users.create({
      data: {
        fullname: user.fullname,
        email: user.email,
        password: passwordHash,
        // franchies_id: user.franchies_id,
        department_id: user.department_id,
        role_id: user.role_id,
        status: true,
        created_by: UserId,
      },
    });

    return newUser;
  },
  LoginUserService: async (user) => {
    const foundUser = await prisma.users.findFirst({
      where: {
        email: user.email,
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

    // Giả sử bạn có hàm SignAccessToken và signRefreshToken để tạo các token
    const accessToken = await SignAccessToken(foundUser.id, foundUser.role_id);
    const refreshToken = await signRefreshToken(foundUser.id);

    return { accessToken, refreshToken };
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
