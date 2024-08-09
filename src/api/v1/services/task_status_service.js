const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  BadRequestError,
  ConflictRequestError,
} = require("../../../core/error.response");
const { buildWhereClause } = require("../../../utils/searchUtils");
const {
  validatedUserId,
  validateRefDepartment,
  validateRefTaskStatusType,
} = require("../../../middleware/validate/validateReferencer");
const { format } = require("date-fns");
const { createNotificationService } = require("./notification_service");
const { checkRoleParent } = require("../../../utils/checkParentRole");
const TaskStatusStatusCodes = {
  2: "Đã tiếp nhận",
  3: "Đã hoàn thành",
};

module.exports = {
  getAllTaskStatusByTaskIdService: async (queryParams) => {
    const { filterField, operator, value, page, limit } = queryParams;

    // Fetch all with pagination
    const pageNum = parseInt(page) || 1; // Mặc định là trang 1 nếu không được cung cấp
    const pageSize = parseInt(limit) || 10; // Mặc định 10 sản phẩm mỗi trang nếu không được cung cấp
    const skip = (pageNum - 1) * pageSize;
    const where = await buildWhereClause({ filterField, operator, value });
    //sort DESC

    let taskStatuses = await prisma.task_status.findMany({
      skip: skip,
      take: pageSize,
      where,

      include: {
        users: true,
        tasks: true,
      },
    });
    taskStatuses = taskStatuses.map((taskStatus) => {
      return {
        key: taskStatus.id.toString(),
        time: format(new Date(taskStatus.updated_time), "yyyy-MM-dd HH:mm:ss"),
        title: `${taskStatus.old_value} → ${taskStatus.new_value}`,

        status: taskStatus.new_value,
      };
    });

    return taskStatuses.length ? taskStatuses : [];
  },
};
