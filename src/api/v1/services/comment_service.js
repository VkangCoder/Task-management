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
  validateRefTaskType,
  validatedReFTaskId,
} = require("../../../middleware/validate/validateReferencer");
const { format } = require("date-fns");
const { createNotificationService } = require("./notification_service");

module.exports = {
  //   getAllCommentsService: async (queryParams) => {
  //     const { filterField, operator, value, page, limit } = queryParams;

  //     // Fetch all with pagination
  //     const pageNum = parseInt(page) || 1; // Mặc định là trang 1 nếu không được cung cấp
  //     const pageSize = parseInt(limit) || 10; // Mặc định 10 sản phẩm mỗi trang nếu không được cung cấp
  //     const skip = (pageNum - 1) * pageSize;
  //     const where = await buildWhereClause({ filterField, operator, value });
  //     //sort DESC
  //     const orderBy = { created_at: "desc" }; // Thay 'desc' bằng 'asc' nếu bạn muốn sắp xếp tăng dần

  //     let Comments = await prisma.tasks.findMany({
  //       skip: skip,
  //       take: pageSize,
  //       where,
  //       orderBy,
  //       include: {
  //         users_tasks_updated_byTousers: true,
  //         users_tasks_created_byTousers: true,
  //         task_status: {
  //           include: {
  //             users: true,
  //           },
  //         },
  //         department: true,
  //         task_types: true,
  //       },
  //     });
  //     Comments = Comments.map((task) => {
  //       const formatTask = {
  //         ...task,
  //         created_at: format(new Date(task.created_at), "yyyy-MM-dd "),
  //         updated_at: task.updated_at
  //           ? format(new Date(task.updated_at), "yyyy-MM-dd")
  //           : "Chưa Cập Nhật",

  //         created_by: task.users_tasks_created_byTousers.fullname,
  //         updated_by: task.users_tasks_updated_byTousers
  //           ? task.users_tasks_updated_byTousers.fullname
  //           : "Chưa Cập Nhật",

  //         //current_status cần phải update theo thời gian thực
  //         current_status_id: task.task_status.status_name,

  //         department_id: task.department.department_name,
  //         task_types_id: task.task_types.type_name,
  //       };
  //       delete formatTask.users_tasks_updated_byTousers;
  //       delete formatTask.users_tasks_created_byTousers;
  //       delete formatTask.task_status;
  //       delete formatTask.department;
  //       delete formatTask.task_types;

  //       return formatTask;
  //     });
  //     if (Comments.length === 0) {
  //       return [];
  //     }
  //     return Comments;
  //   },
  // getAllCommentsServiceByUserId: async (queryParams, UserId) => {
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
  //   let Comments = await prisma.tasks.findMany({
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
  //   Comments = Comments.map((task) => {
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
  //   if (Comments.length === 0) {
  //     return [];
  //   }
  //   return Comments;
  // },
  createCommentsService: async (Comments, userId) => {
    //Bước 1 check validate các trường tham chiếu ( khóa ngoiaj)
    await validatedReFTaskId(Comments.task_id);
    //B2 : tạo 1 bản ghi mặc định status của 1 task sẽ là chưa tiếp nhận
    const result = await prisma.$transaction(async (prisma) => {
      const newComment = await prisma.comments.create({
        data: {
          task_id: Comments.task_id,
          created_by: userId,
          created_at: new Date(),
          comment: Comments.comment,
          comment_type: Comments.comment_type,
        },
      });
      let updatedTask;
      if (Comments.comment_type === "creator_comment") {
        updatedTask = await prisma.tasks.update({
          where: { id: Comments.task_id },
          data: {
            comment_id: newComment.id,
          },
          select: {
            id: true,
            comment_id: true,
          },
        });
      } else { 
        updatedTask = await prisma.task_status.update({
          where: { task_id: Comments.task_id },
          data: { comment_id: newComment.id },
          select: {
            id: true,
            task_id: true,
            comment_id: true,
          },
        });
      }
      return {
        newComment: newComment,
        updatedTask: updatedTask,
      };
    });
    return {
      metadata: {
        comment_details: {
          id: result.newComment.id,
          task_id: result.newComment.task_id,
          created_by: result.newComment.created_by,
          created_at: result.newComment.created_at,
          comment: result.newComment.comment,
          comment_type: result.newComment.comment_type,
        },
        task_details: result.updatedTask,
      },
    };
    //Sau khi tạo mới 1 task tạo thêm thông báo đi kèm
  },

  receiveTaskService: async (Comments, userId) => {
    const result = await prisma.$transaction(async (prisma) => {
      //bước 1 tìm task cần nhận
      const task = await prisma.tasks.findUnique({
        where: { id: Comments.id },
        include: { task_status: true },
      });
      if (!task) {
        throw new BadRequestError("Task not found");
      }
      // biến đổi các enum 2 thành Đã tiếp nhận , 3 thành Đã hoàn thành
      let newStatus;
      switch (Comments.new_value) {
        case 2:
          newStatus = "Đã tiếp nhận";
          break;
        case 3:
          newStatus = "Đã hoàn thành";
          break;
        case 4:
          newStatus = "Từ chối";
          break;
        default:
          throw new BadRequestError("Invalid status code");
      }

      //bước 2 lấy ra trạng thái cũ của task đó
      const oldStatus = task.task_status ? task.task_status.new_value : "Mới";
      if (oldStatus === newStatus) {
        throw new BadRequestError(
          "Không cập nhật được trạng thái  `" +
            newStatus +
            "` vì nó trùng với trạng thái cũ của task "
        );
      }
      console.log(oldStatus);
      console.log(newStatus);
      //Ràng buộc ko thể chuyển từ chưa tiếp nhận thành đã hoàn thành
      if (oldStatus === "Mới" && newStatus === "Đã hoàn thành") {
        throw new BadRequestError(
          "Không thể chuyển trực tiếp từ 'Mới' sang 'Đã hoàn thành'"
        );
      }
      //bước 3 tạo bản ghi để theo dõi sự cập nhật trạng thái của task đó
      const statusChange = await prisma.task_status.create({
        data: {
          task_id: Comments.id,
          old_value: oldStatus,
          new_value: newStatus,
          updated_by: userId,
          updated_time: new Date(),
          status: true,
          status_name: newStatus,
        },
      });

      //bước 4: tạo thông báo đính kèm khi tiếp nhận hoặc trả task
      const notificationData = {
        noti_type: "Task Assignment",
        noti_content: `${userId}đã tiếp nhận task của bạn`,

        noti_receive_id: task.created_by,
        notification_status_id: Comments.notification_status_id, // Giả sử status_id là 1 cho trạng thái đã tiếp nhận
        noti_sender_id: userId,
      };
      const notification = await createNotificationService(
        notificationData,
        userId
      );
      //
      //bước 5: update current_task_id của Task đó thành mới nhất
      const updateTask = await prisma.tasks.update({
        where: { id: Comments.id },
        data: {
          current_status_id: statusChange.id,

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
