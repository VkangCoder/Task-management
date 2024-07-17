const { PrismaClient } = require("@prisma/client");
const { FORBIDDEN, NotFoundError } = require("../core/error.response");

const prisma = new PrismaClient();
module.exports = {
  checkRoleParent: async (parentRoleCreatedID, AssigneeId) => {
    const parentAssignee = await prisma.users.findUnique({
      where: { id: AssigneeId },
      include: {
        roles_users_role_idToroles: {
          select: {
            parent_role_id: true,
          },
        },
      },
    });

    if (!parentAssignee) {
      throw new NotFoundError(
        "Không tìm thấy thông tin vai trò của người được giao."
      );
    }
    if (
      parentRoleCreatedID >
      parentAssignee.roles_users_role_idToroles.parent_role_id
    ) {
      throw new FORBIDDEN("Bạn Không đủ quyền hạn để giao việc cho người này");
    }
  },
};
