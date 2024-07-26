const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  BadRequestError,
  ConflictRequestError,
} = require("../../../core/error.response");
const { format } = require("date-fns");
const { buildWhereClause } = require("../../../utils/searchUtils");
const {
  validatedUserId,
} = require("../../../middleware/validate/validateReferencer");
module.exports = {
  getAllUsersService: async (queryParams) => {
    const { filterField, operator, value, page, limit } = queryParams;

    // Fetch all with pagination
    const pageNum = parseInt(page) || 1; // Mặc định là trang 1 nếu không được cung cấp
    const pageSize = parseInt(limit) || 10; // Mặc định 10 sản phẩm mỗi trang nếu không được cung cấp
    const skip = (pageNum - 1) * pageSize;
    const where = await buildWhereClause({ filterField, operator, value });
    let Users = await prisma.users.findMany({
      skip: skip,
      take: pageSize,
      where,
    });
    Users = Users.map((user) => {
      const formatuser = {
        ...user,
      };

      return formatuser;
    });
    if (Users.length === 0) {
      return [];
    }
    return Users;
  },
  getUsersByDepartmentId: async (queryParams) => {
    const { filterField, operator, value, page, limit } = queryParams;

    const pageNum = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skip = (pageNum - 1) * pageSize;
    const where = await buildWhereClause({ filterField, operator, value });
    let users = await prisma.users.findMany({
      skip: skip,
      take: pageSize,
      where,
      select: {
        id: true,
        fullname: true, // và các trường thông tin khác bạn muốn hiển thị
      },
    });

    if (users.length === 0) {
      return [];
    }
    return users;
  },
  updateUserByUserIdService: async (userData, userId) => {
    await validatedUserId(userId);
    const updatedUser = await prisma.users.update({
      where: {
        id: parseInt(userId),
      },
      data: {
        fullname: userData.name,
        email: userData.email,
        birthday: userData.birthday,
        gender: userData.gender,
        address: userData.address,
        email: userData.email,
        birthday: userData.birthday,
      },
    });
  },
};
