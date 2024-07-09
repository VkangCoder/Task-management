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
  getAllDepartmentsService: async (queryParams) => {
    const { filterField, operator, value, page, limit } = queryParams;

    // Fetch all with pagination
    const pageNum = parseInt(page) || 1; // Mặc định là trang 1 nếu không được cung cấp
    const pageSize = parseInt(limit) || 10; // Mặc định 10 sản phẩm mỗi trang nếu không được cung cấp
    const skip = (pageNum - 1) * pageSize;
    const where = await buildWhereClause({ filterField, operator, value });
    let Departments = await prisma.department.findMany({
      skip: skip,
      take: pageSize,
      where,
    });
    Departments = Departments.map((department) => {
      const formatdepartment = {
        ...department,
      };

      return formatdepartment;
    });
    if (Departments.length === 0) {
      return [];
    }
    return Departments;
  },
  getAllListIdDepartmentsService: async (queryParams) => {
    const { filterField, operator, value, page, limit } = queryParams;

    // Fetch all with pagination
    const pageNum = parseInt(page) || 1; // Mặc định là trang 1 nếu không được cung cấp
    const pageSize = parseInt(limit) || 10; // Mặc định 10 sản phẩm mỗi trang nếu không được cung cấp
    const skip = (pageNum - 1) * pageSize;
    const where = await buildWhereClause({ filterField, operator, value });
    let Departments = await prisma.department.findMany({
      skip: skip,
      take: pageSize,
      select: { id: true, department_name: true },
    });
    Departments = Departments.map((department) => {
      const formatdepartment = {
        ...department,
      };

      return formatdepartment;
    });
    if (Departments.length === 0) {
      return [];
    }
    return Departments;
  },
};
