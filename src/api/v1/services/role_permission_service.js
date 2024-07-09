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
  getAllRolePermissionsService: async (queryParams) => {
    const { filterField, operator, value, page, limit } = queryParams;

    // Fetch all with pagination
    const pageNum = parseInt(page) || 1; // Mặc định là trang 1 nếu không được cung cấp
    const pageSize = parseInt(limit) || 10; // Mặc định 10 sản phẩm mỗi trang nếu không được cung cấp
    const skip = (pageNum - 1) * pageSize;
    const where = await buildWhereClause({ filterField, operator, value });
    let RolePermissions = await prisma.role_permissions.findMany({
      skip: skip,
      take: pageSize,
      where,
      include: {
        roles: true,
        users_role_permissions_created_byTousers: true,
        users_role_permissions_updated_byTousers: true,
      },
    });
    RolePermissions = RolePermissions.map((rolepermissions) => {
      const formatrolepermissions = {
        ...rolepermissions,
        role_id: rolepermissions.roles.role_name,
        created_at: format(new Date(rolepermissions.created_at), "yyyy-MM-dd "),
        last_updated_at: rolepermissions.updated_at
          ? format(new Date(rolepermissions.updated_at), "yyyy-MM-dd")
          : "Not yet updated",
        created_by:
          rolepermissions.users_role_permissions_created_byTousers.fullname,
        updated_by: rolepermissions.users_role_permissions_updated_byTousers
          ? task.users_role_permissions_updated_byTousers.fullname
          : "Not yet updated",
      };
      delete formatrolepermissions.roles;
      delete formatrolepermissions.users_role_permissions_created_byTousers;
      delete formatrolepermissions.users_role_permissions_updated_byTousers;
      return formatrolepermissions;
    });
    if (RolePermissions.length === 0) {
      return [];
    }
    return RolePermissions;
  },
  //   getAllListIdRolePermissionsService: async (queryParams) => {
  //     const { filterField, operator, value, page, limit } = queryParams;

  //     // Fetch all with pagination
  //     const pageNum = parseInt(page) || 1; // Mặc định là trang 1 nếu không được cung cấp
  //     const pageSize = parseInt(limit) || 10; // Mặc định 10 sản phẩm mỗi trang nếu không được cung cấp
  //     const skip = (pageNum - 1) * pageSize;
  //     const where = await buildWhereClause({ filterField, operator, value });
  //     let RolePermissions = await prisma.role_permissions.findMany({
  //       skip: skip,
  //       take: pageSize,
  //       select: { id: true, rolepermissions_name: true },
  //     });
  //     RolePermissions = RolePermissions.map((rolepermissions) => {
  //       const rolepermissions = {
  //         ...rolepermissions,
  //       };

  //       return rolepermissions;
  //     });
  //     if (RolePermissions.length === 0) {
  //       return [];
  //     }
  //     return RolePermissions;
  //   },
  
  createRolePermissionsService: async (RolePermissions, userId) => {
    const result = await prisma.$transaction(async (prisma) => {
      const newrolepermissions = await prisma.role_permissions.create({
        data: {
          role_id: RolePermissions.role_id,
          permission_name: RolePermissions.permission_name,
          created_by: userId,
          status: true,
        },
      });
      //
      return newrolepermissions;
    });
    return result;
  },
};
