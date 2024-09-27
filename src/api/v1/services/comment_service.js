"use strict";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  BadRequestError,
  ConflictRequestError,
  NotFoundError,
} = require("../../../core/error.response");
const { buildWhereClause } = require("../../../utils/searchUtils");
const {
  validateParentComentId,
} = require("../../../middleware/validate/validateReferencer");
const { format } = require("date-fns");
//
//hàm tìm max node right của 1 comments

class CommentService {
  constructor(prisma) {
    this.prisma = prisma;
  }
  static async createComment(CommentData, userId) {
    let rightValue;
    //reply comment
    if (CommentData.parent_comment_id) {
      //lấy ra giá trị right của comment cha
      const parentComment = await prisma.comments.findUnique({
        where: { id: CommentData.parent_comment_id },
        select: { comment_right: true },
      });
      if (!parentComment) throw new NotFoundError("parent comment not found");

      rightValue = parentComment.comment_right;

      // Cập nhật các giá trị comment_right và comment_left của các comment hiện có
      await prisma.comments.updateMany({
        where: {
          comment_right: {
            gte: rightValue,
          },
        },
        data: {
          comment_right: {
            increment: 2,
          },
        },
      });

      // Cập nhật comment_left
      await prisma.comments.updateMany({
        where: {
          comment_left: {
            gt: rightValue,
          },
        },
        data: {
          comment_left: {
            increment: 2,
          },
        },
      });
    } else {
      const maxRightValue = await prisma.comments.findFirst({
        where: { task_id: CommentData.task_id },
        orderBy: { comment_right: "desc" },
      });
      if (maxRightValue) rightValue = maxRightValue.comment_right + 1;
      else {
        rightValue = 1;
      }
    }

    return await prisma.comments.create({
      data: {
        task_id: CommentData.task_id,
        created_by: userId,
        content: CommentData.content,
        parent_comment_id: CommentData.parent_comment_id,
        comment_right: rightValue + 1,
        comment_left: rightValue,
        created_at: new Date(),
      },
    });
  }
  static async getCommentsByParentId(queryParams) {
    const { task_id, parent_comment_id, page, limit } = queryParams;

    const pageNum = parseInt(page) || 1; // Mặc định là trang 1 nếu không được cung cấp
    const pageSize = parseInt(limit) || 10; // Mặc định 10 sản phẩm mỗi trang nếu không được cung cấp
    const skip = (pageNum - 1) * pageSize;
    if (parent_comment_id) {
      const parent = await prisma.comments.findUnique({
        where: {
          id: parseInt(parent_comment_id),
        },
      });
      if (!parent) throw new NotFoundError("Parent comment is not exist");
      console.log(parent);
      let ListComments = await prisma.comments.findMany({
        skip: skip,
        take: pageSize,
        where: {
          task_id: parseInt(task_id),

          comment_left: { gt: parent.comment_left },
          comment_right: { lte: parent.comment_right },
        },
        orderBy: [
          { comment_left: "desc" }, // Sắp xếp tăng dần theo comment_left
          { created_at: "desc" }, // Sắp xếp giảm dần theo thời gian tạo
        ],
        select: {
          id: true,
          task_id: true,
          comment_left: true,
          comment_right: true,
          content: true,
          parent_comment_id: true,
          created_at: true,
          // users_comments_created_byTousers: {
          //   select: {
          //     id: true,
          //     fullname: true,
          //   },
          // },
          // users_comments_updated_byTousers: {
          //   select: {
          //     id: true,
          //     fullname: true,
          //   },
          // },
        },
      });
      return ListComments;
    } else {
      let ListComments = await prisma.comments.findMany({
        skip: skip,
        take: pageSize,
        where: {
          task_id: parseInt(task_id),
          parent_comment_id: null,
        },
        orderBy: [
          { comment_left: "asc" }, // Sắp xếp tăng dần theo comment_left
          { created_at: "desc" }, // Sắp xếp giảm dần theo thời gian tạo
        ],
        select: {
          id: true,
          task_id: true,
          comment_left: true,
          comment_right: true,
          content: true,
          created_at: true,
          // users_comments_created_byTousers: {
          //   select: {
          //     id: true,
          //     fullname: true,
          //   },
          // },
          // users_comments_updated_byTousers: {
          //   select: {
          //     id: true,
          //     fullname: true,
          //   },
          // },
        },
      });
      return ListComments;
    }
  }
  static async deleteComments(deleteData) {
    console.log(deleteData);
    //check the task exist in the database
    const foundTask = await prisma.tasks.findUnique({
      where: {
        id: deleteData.task_id, // Chắc chắn rằng task_id là một số nguyên và được truyền đúng.
      },
    });
    if (!foundTask) throw new NotFoundError("Task not found");
    //1. xác định giá trị left và right
    const comment = await prisma.comments.findUnique({
      where: {
        id: deleteData.commentId,
      },
    });
    if (!comment) throw new NotFoundError("Comment not found");
    const leftValue = comment.comment_left;
    const rightValue = comment.comment_right;
    //tính width
    const width = rightValue - leftValue + 1;
    //xóa tất cả comment con nằm trong width
    await prisma.comments.deleteMany({
      where: {
        task_id: deleteData.task_id,
        comment_left: { gte: leftValue, lte: rightValue },
      },
    });
    //4. update tất cả giá trị left và right còn lại
    await prisma.comments.updateMany({
      where: {
        task_id: deleteData.task_id,
        comment_right: {
          gt: rightValue,
        },
      },
      data: {
        comment_right: {
          increment: -width,
        },
      },
    });
    await prisma.comments.updateMany({
      where: {
        task_id: deleteData.task_id,
        comment_left: {
          gt: rightValue,
        },
      },
      data: {
        comment_left: {
          increment: -width,
        },
      },
    });
    return true;
  }
}

module.exports = CommentService;
//   getCommentInCommentService: async (queryParams) => {
//     const { filterField, operator, value, page, limit } = queryParams;

//     // Fetch all with pagination
//     const pageNum = parseInt(page) || 1; // Mặc định là trang 1 nếu không được cung cấp
//     const pageSize = parseInt(limit) || 10; // Mặc định 10 sản phẩm mỗi trang nếu không được cung cấp
//     const skip = (pageNum - 1) * pageSize;
//     const where = await buildWhereClause({ filterField, operator, value });
//     //sort DESC
//     const orderBy = { comment_left: "asc" }; // Thay 'desc' bằng 'asc' nếu bạn muốn sắp xếp tăng dần
//     //
//     let Comments = await prisma.comments.findMany({
//       skip: skip,
//       take: pageSize,
//       where,
//       orderBy,
//     });
//     return Comments;
//   },
// };
