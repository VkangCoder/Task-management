const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const argon2 = require("argon2");
const {
  BadRequestError,
  ConflictRequestError,
} = require("../../core/error.response");
const {
  SignAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../services/jwt_service");
module.exports = {
  RegisterUserService: async (user, userId) => {
    const holderUser = await prisma.users.findMany({
      where: {
        email: user.email,
      },
    });
    // Sửa ở đây: kiểm tra nếu mảng holderUser không rỗng
    if (holderUser.length > 0) {
      throw new ConflictRequestError("Error: User already registered!");
    }
    const passwordHash = await argon2.hash(user.password, 10);
    const newUser = await prisma.users.create({
      data: {
        username: user.username,
        email: user.email,
        password: passwordHash,
        franchies_id: user.franchies_id,
        role_id: user.role_id,
        status: user.status,
        created_by: userId,
      },
    });

    return newUser;
  },
  LoginUserService: async (user) => {
    // Giả sử userValidate là một hàm bạn đã định nghĩa để validate thông tin người dùng// Bạn cần cung cấp định nghĩa cho hàm này
    console.log(user);
    // Tìm người dùng dựa trên email thay vì username (tùy thuộc vào schema của bạn)
    const foundUser = await prisma.users.findUnique({
      where: {
        email: user.email,
      },
    });

    if (!foundUser) {
      throw new BadRequestError("User have not registered");
    }

    // Kiểm tra mật khẩu
    const isValid = await bcrypt.compare(user.password, foundUser.password);
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
