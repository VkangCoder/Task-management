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
  RegisterUserSerivce: async (user, userId) => {
    const holderEmail = await prisma.users.findUnique({
      where: {
        email: user.email,
      },
    });
    if (holderEmail) throw new ConflictRequestError("Email đã tồn tại");
    const newUser = await prisma.users.create({
      data: {
        email: user.email,
        fullname: user.fullname,
        role_id: user.role_id,
        department_id: user.department_id,
        phone_number: user.phone_number,
        gender: user.gender,
        franchise_id: user.franchise_id,
        password: user.password,
        created_by: userId,
        status: true,
      },
    });
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
