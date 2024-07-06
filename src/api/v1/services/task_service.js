const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  BadRequestError,
  ConflictRequestError,
} = require("../../../core/error.response");
const { format } = require("date-fns");
const { buildWhereClause } = require("../../../utils/searchUtils");
module.exports = {
  getAllTasksService: async (queryParams) => {
    const { filterField, operator, value, page, limit } = queryParams;

    // Fetch all with pagination
    const pageNum = parseInt(page) || 1; // Mặc định là trang 1 nếu không được cung cấp
    const pageSize = parseInt(limit) || 10; // Mặc định 10 sản phẩm mỗi trang nếu không được cung cấp
    const skip = (pageNum - 1) * pageSize;
    const where = await buildWhereClause({ filterField, operator, value });
    let Tasks = await prisma.tasks.findMany({
      skip: skip,
      take: pageSize,
      where,
      include: {
        users_tasks_assignee_idTousers: true,
        users_tasks_updated_byTousers: true,
        users_tasks_created_byTousers: true,
        task_status_current: true,
      },
    });
    Tasks = Tasks.map((task) => {
      const formatTask = {
        ...task,
        created_at: format(new Date(task.created_at), "yyyy-MM-dd "),
        updated_at: task.updated_at
          ? format(new Date(task.updated_at), "yyyy-MM-dd")
          : "Not yet updated",
        end_at: format(new Date(task.end_at), "yyyy-MM-dd "),
        created_by: task.users_tasks_created_byTousers.fullname,
        updated_by: task.users_tasks_updated_byTousers
          ? task.users_tasks_updated_byTousers.fullname
          : "Not yet updated",
        assignee_id: task.users_tasks_assignee_idTousers.fullname,
        current_status_id: task.current_status_id.status_name,
      };
      delete formatTask.users_tasks_assignee_idTousers;
      delete formatTask.users_tasks_updated_byTousers;
      delete formatTask.users_tasks_created_byTousers;
      delete formatTask.task_status_current;
      return formatTask;
    });
    if (Tasks.length === 0) {
      return [];
    }
    return Tasks;
  },
  createTasksService: async (Tasks, userId) => {
    //check id assign

    //check id current status
    console.log(Tasks);

    const newTasks = await prisma.tasks.create({
      data: {
        title: Tasks.title,
        description: Tasks.description,
        assignee_id: Tasks.assignee_id,
        priority: Tasks.priority,
        created_by: userId,
        end_at: new Date(Tasks.end_at), // sử dụng ngày hết hạn được cung cấp
        current_status_id: Tasks.current_status_id, // Thêm cột này để lưu trữ trạng thái hiện tại của task
        status: true,
      },
    });
    return newTasks;
  },
};
