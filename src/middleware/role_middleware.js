const { PrismaClient } = require("@prisma/client");
const { FORBIDDEN } = require("../core/error.response");
const prisma = new PrismaClient();

module.exports = {
  checkRolePermission: (requiredPermission) => {
    return async (req, res, next) => {
      const { roleID } = req.payload;

      const userPermission = await prisma.role_permissions.findMany({
        where: {
          role_id: roleID,
          permission_name: requiredPermission, // Giả sử cột này lưu trữ ID của vai trò
        },
      });
      if (userPermission.length == 0) {
        const error = new FORBIDDEN(
          `User không có quyền ${requiredPermission}`
        );
        // Gửi lỗi đến middleware xử lý lỗi tiếp theo
        next(error);
      }
      next();
    };
  },
};
