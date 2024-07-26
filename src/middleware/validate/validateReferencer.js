const { PrismaClient } = require("@prisma/client");
const { NotFoundError } = require("../../core/error.response");

const prisma = new PrismaClient();
module.exports = {
  validatedUserId: async (id) => {
    const userExists = await prisma.users.findUnique({
      where: { id: id },
      select: {
        id: true,
      },
    });
    if (!userExists) {
      throw new NotFoundError("Id Người Dùng không tồn tại");
    }
    return userExists;
  },

  validateRefRole: async (id) => {
    const isExistFloor = await prisma.roles.findUnique({
      where: { id: id },
      select: {
        id: true,
      },
    });
    if (!isExistFloor) {
      throw new NotFoundError("Id Roles không tồn tại ");
    }
  },
  validateRefRolePermission: async (id) => {
    const isExistFloor = await prisma.role_permissions.findUnique({
      where: { id: id },
      select: {
        id: true,
      },
    });
    if (!isExistFloor) {
      throw new NotFoundError("Id Role Permission không tồn tại ");
    }
    return isExistFloor;
  },

  validateRefMenuRole: async (id) => {
    const isExistFloor = await prisma.menu_role.findUnique({
      where: { id: id },
      select: {
        id: true,
      },
    });
    if (!isExistFloor) {
      throw new NotFoundError("MenuRole ID không tồn tại ");
    }
    return isExistFloor;
  },
  validateRefCurrentStatus: async (id) => {
    const isExistCurrentStatus = await prisma.task_status.findUnique({
      where: { id: id },
      select: { id: true },
    });
    if (!isExistCurrentStatus) {
      throw new NotFoundError("Current Status ID không tồn tại ");
    }
    return next();
  },
  validateRefDepartment: async (id) => {
    const isExistDepartment = await prisma.department.findUnique({
      where: { id: id },
      select: {
        id: true,
      },
    });
    if (!isExistDepartment) {
      throw new NotFoundError("Id Department không tồn tại ");
    }
  },
};
