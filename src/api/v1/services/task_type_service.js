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
} = require("../../../middleware/validate/validateReferencer");
const { format } = require("date-fns");
const { createNotificationService } = require("./notification_service");
const { checkRoleParent } = require("../../../utils/checkParentRole");
const TaskStatusCodes = {
  2: "Đã tiếp nhận",
  3: "Đã hoàn thành",
};

module.exports = {
  getAllTask_TypeService: async (queryParams) => {
    const { filterField, operator, value, page, limit } = queryParams;

    // Fetch all with pagination
    const pageNum = parseInt(page) || 1; // Mặc định là trang 1 nếu không được cung cấp
    const pageSize = parseInt(limit) || 10; // Mặc định 10 sản phẩm mỗi trang nếu không được cung cấp
    const skip = (pageNum - 1) * pageSize;
    const where = await buildWhereClause({ filterField, operator, value });
    //sort DESC
    const orderBy = { created_at: "desc" }; // Thay 'desc' bằng 'asc' nếu bạn muốn sắp xếp tăng dần

    let Task_Type = await prisma.task_types.findMany({
      skip: skip,
      take: pageSize,
      where,
      orderBy,
      include: {
        department: true,
        users_task_types_created_byTousers: true,
        users_task_types_updated_byTousers: true,
      },
    });
    Task_Type = Task_Type.map((task_type) => {
      const formatTask = {
        ...task_type,
        created_at: format(new Date(task_type.created_at), "yyyy-MM-dd "),
        updated_at: task_type.updated_at
          ? format(new Date(task_type.updated_at), "yyyy-MM-dd")
          : "Not yet updated",

        created_by: task_type.users_task_types_created_byTousers.fullname,
        updated_by: task_type.users_task_types_updated_byTousers
          ? task_type.users_task_types_updated_byTousers.fullname
          : "Not yet updated",

        //current_status cần phải update theo thời gian thực

        department_id: task_type.department.department_name,
      };
      delete formatTask.users_task_types_updated_byTousers;
      delete formatTask.users_task_types_created_byTousers;

      delete formatTask.department;

      return formatTask;
    });
    if (Task_Type.length === 0) {
      return [];
    }
    return Task_Type;
  },
  // getAllTask_TypeServiceByUserId: async (queryParams, UserId) => {
  //   const { filterField, operator, value, page, limit, sortBy, sortOrder } =
  //     queryParams;

  //   const pageNum = parseInt(page) || 1; // Mặc định là trang 1 nếu không được cung cấp
  //   const pageSize = parseInt(limit) || 10; // Mặc định 10 sản phẩm mỗi trang nếu không được cung cấp
  //   const skip = (pageNum - 1) * pageSize;
  //   const where = await buildWhereClause({ filterField, operator, value });
  //   //sắp xếp
  //   const orderBy = sortBy && sortOrder ? { [sortBy]: sortOrder } : {};

  //   //Lọc trên asignee_id
  //   if (UserId) {
  //     where.assignee_id = parseInt(UserId);
  //   }
  //   let Task_Type = await prisma.tasks.findMany({
  //     skip: skip,
  //     take: pageSize,
  //     where,
  //     orderBy,
  //     include: {
  //       users_tasks_assignee_idTousers: true,
  //       users_tasks_updated_byTousers: true,
  //       users_tasks_created_byTousers: true,
  //       task_status: true,
  //     },
  //   });
  //   Task_Type = Task_Type.map((task) => {
  //     const formatTask = {
  //       ...task,
  //       created_at: format(new Date(task.created_at), "yyyy-MM-dd "),
  //       updated_at: task.updated_at
  //         ? format(new Date(task.updated_at), "yyyy-MM-dd")
  //         : "Not yet updated",
  //       end_at: format(new Date(task.end_at), "yyyy-MM-dd "),
  //       created_by: task.users_tasks_created_byTousers.fullname,
  //       updated_by: task.users_tasks_updated_byTousers
  //         ? task.users_tasks_updated_byTousers.fullname
  //         : "Not yet updated",

  //       assignee_id: task.users_tasks_assignee_idTousers.fullname,
  //       //current_status cần phải update theo thời gian thực
  //       current_status_id: task.task_status.status_name,
  //       status_change: {
  //         old_value: task.task_status.old_value, // Cần có cơ chế để truy xuất giá trị này
  //         new_value: task.task_status.new_value, // Cần có cơ chế để truy xuất giá trị này
  //         updated_by: task.task_status.updated_by,
  //       },
  //     };
  //     delete formatTask.users_tasks_assignee_idTousers;
  //     delete formatTask.users_tasks_updated_byTousers;
  //     delete formatTask.users_tasks_created_byTousers;
  //     delete formatTask.task_status;

  //     return formatTask;
  //   });
  //   if (Task_Type.length === 0) {
  //     return [];
  //   }
  //   return Task_Type;
  // },
  createTask_TypeService: async (TaskTypeData, userId) => {
    //Bước 1 check validate các trường tham chiếu ( khóa ngoiaj)
    const holderDepartment = await validateRefDepartment(
      TaskTypeData.department_id
    );

    const newTask_Type = await prisma.$transaction(async (prisma) => {
      const taskType = await prisma.task_types.create({
        data: {
          type_name: TaskTypeData.type_name,
          department_id: TaskTypeData.department_id,
          created_by: userId,
          status: true,
        },
      });
      // Đoạn mã tạo thông báo đi kèm
      // Ví dụ: await prisma.notifications.create({...})

      return taskType;
    });
    return newTask_Type;
  },
};
