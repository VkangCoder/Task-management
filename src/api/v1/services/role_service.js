const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  BadRequestError,
  ConflictRequestError,
} = require("../../../core/error.response");
const { format } = require("date-fns");
const { buildWhereClause } = require("../../../utils/searchUtils");
const { id } = require("date-fns/locale");
module.exports = {
  getAllRolesService: async (queryParams) => {
    const { filterField, operator, value, page, limit } = queryParams;

    // Fetch all with pagination
    const pageNum = parseInt(page) || 1; // Mặc định là trang 1 nếu không được cung cấp
    const pageSize = parseInt(limit) || 10; // Mặc định 10 sản phẩm mỗi trang nếu không được cung cấp
    const skip = (pageNum - 1) * pageSize;
    const where = await buildWhereClause({ filterField, operator, value });
    let Roles = await prisma.roles.findMany({
      skip: skip,
      take: pageSize,
      where,
    });
    Roles = Roles.map((role) => {
      const formatrole = {
        ...role,
      };

      return formatrole;
    });
    if (Roles.length === 0) {
      return [];
    }
    return Roles;
  },
  getAllListIdRolesService: async (queryParams) => {
    const { filterField, operator, value, page, limit } = queryParams;

    // Fetch all with pagination
    const pageNum = parseInt(page) || 1; // Mặc định là trang 1 nếu không được cung cấp
    const pageSize = parseInt(limit) || 10; // Mặc định 10 sản phẩm mỗi trang nếu không được cung cấp
    const skip = (pageNum - 1) * pageSize;
    const where = await buildWhereClause({ filterField, operator, value });
    let Roles = await prisma.roles.findMany({
      skip: skip,
      take: pageSize,
      select: { id: true, role_name: true },
    });
    Roles = Roles.map((role) => {
      const formatrole = {
        ...role,
      };

      return formatrole;
    });
    if (Roles.length === 0) {
      return [];
    }
    return Roles;
  },
  createRolesService: async (Roles, userId) => {
    const result = await prisma.$transaction(async (prisma) => {
      const newrole = await prisma.roles.create({
        data: {
          role_name: Roles.role_name,
          created_by: userId,
          status: true,
        },
      });
      //
      return newrole;
    });
    return result;
  },
};
