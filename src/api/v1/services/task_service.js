const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  BadRequestError,
  ConflictRequestError,
} = require("../../../core/error.response");
const { buildWhereClause } = require("../../../utils/searchUtils");
const {
  validatedUserId,
} = require("../../../middleware/validate/validateReferencer");
const { format } = require("date-fns");
const { createNotificationService } = require("./notification_service");

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
        task_status: true,
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
        //current_status cần phải update theo thời gian thực
        current_status_id: task.task_status.status_name,
        status_change: {
          old_value: task.task_status.old_value, // Cần có cơ chế để truy xuất giá trị này
          new_value: task.task_status.new_value, // Cần có cơ chế để truy xuất giá trị này
          updated_by: task.task_status.updated_by,
        },
      };
      delete formatTask.users_tasks_assignee_idTousers;
      delete formatTask.users_tasks_updated_byTousers;
      delete formatTask.users_tasks_created_byTousers;
      delete formatTask.task_status;

      return formatTask;
    });
    if (Tasks.length === 0) {
      return [];
    }
    return Tasks;
  },
  getAllTasksServiceByUserId: async (queryParams, UserId) => {
    const { filterField, operator, value, page, limit } = queryParams;

    const pageNum = parseInt(page) || 1; // Mặc định là trang 1 nếu không được cung cấp
    const pageSize = parseInt(limit) || 10; // Mặc định 10 sản phẩm mỗi trang nếu không được cung cấp
    const skip = (pageNum - 1) * pageSize;
    const where = await buildWhereClause({ filterField, operator, value });
    //Lọc trên asignee_id
    if (UserId) {
      where.assignee_id = parseInt(UserId);
    }
    let Tasks = await prisma.tasks.findMany({
      skip: skip,
      take: pageSize,
      where,
      include: {
        users_tasks_assignee_idTousers: true,
        users_tasks_updated_byTousers: true,
        users_tasks_created_byTousers: true,
        task_status: true,
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
        //current_status cần phải update theo thời gian thực
        current_status_id: task.task_status.status_name,
        status_change: {
          old_value: task.task_status.old_value, // Cần có cơ chế để truy xuất giá trị này
          new_value: task.task_status.new_value, // Cần có cơ chế để truy xuất giá trị này
          updated_by: task.task_status.updated_by,
        },
      };
      delete formatTask.users_tasks_assignee_idTousers;
      delete formatTask.users_tasks_updated_byTousers;
      delete formatTask.users_tasks_created_byTousers;
      delete formatTask.task_status;

      return formatTask;
    });
    if (Tasks.length === 0) {
      return [];
    }
    return Tasks;
  },
  createTasksService: async (Tasks, userId) => {
    //Bước 1 check validate các trường tham chiếu ( khóa ngoiaj)
    //check id assign
    const holderTaskEndAt = new Date(Tasks.end_at);
    const holderTaskCreateAt = new Date(); // Lấy ngày hiện tại từ server làm ngày tạo
    const formatHolderTaskCreateAt = format(holderTaskCreateAt, "yyyy-MM-dd");
    await validatedUserId(Tasks.assignee_id);
    //Ngày hết hạn của task phải lớn hơn ngày hiện tại
    if (holderTaskEndAt <= holderTaskCreateAt) {
      throw new BadRequestError(
        `Ngày hết hạn của task phải lớn hơn ${formatHolderTaskCreateAt}`
      );
    }
    //B2 : tạo 1 bản ghi mặc định status của 1 task sẽ là chưa tiếp nhận
    const result = await prisma.$transaction(async (prisma) => {
      const initialStatus = await prisma.task_status.create({
        data: {
          task_id: null, // Sẽ cập nhật sau khi task được tạo
          old_value: "Chưa Tiếp Nhận", // Giả định không có trạng thái trước đó
          new_value: "Chưa Tiếp Nhận",
          updated_by: userId,
          updated_time: new Date(),
          status: true,
          status_name: "Chưa Tiếp Nhận",
        },
      });
      //
      //Bước 3 : tạo task với current_status vừa đc tạo nên
      const newTasks = await prisma.tasks.create({
        data: {
          title: Tasks.title,
          description: Tasks.description,
          //drop down tên nhân viên
          assignee_id: Tasks.assignee_id,

          priority: Tasks.priority,
          created_by: userId,
          end_at: new Date(Tasks.end_at), // sử dụng ngày hết hạn được cung cấp
          current_status_id: initialStatus.id, // Thêm cột này để lưu trữ trạng thái hiện tại của task
          status: true,
        },
      });

      return newTasks;
    });
    //Sau khi tạo mới 1 task tạo thêm thông báo đi kèm

    const notificationData = {
      noti_type: "Task Assignment",
      noti_content: `You have been assigned a new task: ${result.title}`,
      noti_receive_id: result.assignee_id,
      notification_status_id: 1, // Ví dụ status_id là 1 cho thông báo mới
      noti_sender_id: result.created_by,
    };
    await createNotificationService(notificationData, result.created_by);

    return result;
  },
  receiveTaskService: async (Tasks, userId) => {
    const result = await prisma.$transaction(async (prisma) => {
      //bước 1 tìm task cần nhận
      const task = await prisma.tasks.findUnique({
        where: { id: Tasks.id },
        include: { task_status: true },
      });
      if (!task) {
        throw new BadRequestError("Task not found");
      }
      //bước 2 lấy ra trạng thái cũ của task đó
      const oldStatus = task.task_status
        ? task.task_status.new_value
        : "Chưa Tiếp Nhận";
      if (oldStatus === Tasks.new_value) {
        throw new BadRequestError(
          "Không cập nhật được trạng thái  `" +
            Tasks.new_value +
            "` vì nó trùng với trạng thái cũ của task "
        );
      }
      //bước 3 tạo bản ghi để theo dõi sự cập nhật trạng thái của task đó
      const statusChange = await prisma.task_status.create({
        data: {
          task_id: Tasks.id,
          old_value: oldStatus,
          new_value: Tasks.new_value,
          updated_by: userId,
          updated_time: new Date(),
          status: true,
          status_name: Tasks.new_value,
        },
      });

      //bước 4: tạo thông báo đính kèm khi tiếp nhận hoặc trả task
      const notificationData = {
        noti_type: "Task Assignment",
        noti_content:
          "Người tiếp nhận đã cập nhật trạng thái của task `" +
          task.title +
          "` thành `" +
          statusChange.new_value +
          "`",
        noti_receive_id: task.created_by,
        notification_status_id: Tasks.notification_status_id, // Giả sử status_id là 1 cho trạng thái đã tiếp nhận
        noti_sender_id: userId,
      };
      const notification = await createNotificationService(
        notificationData,
        userId
      );
      //
      //bước 5: update current_task_id của Task đó thành mới nhất
      const updateTask = await prisma.tasks.update({
        where: { id: Tasks.id },
        data: {
          current_status_id: statusChange.id,

          updated_by: userId,
          // Cập nhật với ID của bản ghi trạng thái mới nhất
        },
      });
      return {
        success: true,
        message: "Task đã được cập nhật và đã gửi thông báo tới người giao .",
      };
    });
    return result;
  },
};
