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
async function getMaxRightValue(prisma, task_id) {
  const lastComment = await prisma.comments.findFirst({
    where: { task_id: task_id },
    orderBy: { comment_right: "desc" },
  });
  return lastComment ? lastComment.comment_right : 0;
}

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
        comment_right: rightValue + 1,
        comment_left: rightValue,
        created_at: new Date(),
      },
    });
  }
  static async getAllCommentsByTaskID(queryParams) {
    const { filterField, operator, value, page, limit } = queryParams;
    const pageNum = parseInt(page) || 1; // Mặc định là trang 1 nếu không được cung cấp
    const pageSize = parseInt(limit) || 10; // Mặc định 10 sản phẩm mỗi trang nếu không được cung cấp
    const skip = (pageNum - 1) * pageSize;
    const where = await buildWhereClause({ filterField, operator, value });
    const orderBy = { created_at: "desc" }; // Thay 'desc' bằng 'asc' nếu bạn muốn sắp xếp tăng dần
    where.parent_comment_id = null;

    let ListComments = await prisma.comments.findMany({
      skip: skip,
      take: pageSize,
      where,
      orderBy,
      // include: {
      //   users_comments_created_byTousers: true,
      //   users_comments_updated_byTousers: true,
      // },
    });
    // ListComments = ListComments.map((comment) => {
    //   const formatComment = {
    //     ...comment,
    //     created_at: format(new Date(comment.created_at), "yyyy-MM-dd "),
    //     updated_at: comment.updated_at
    //       ? format(new Date(comment.updated_at), "yyyy-MM-dd")
    //       : "Chưa Cập Nhật",

    //     created_by: comment.users_comments_created_byTousers.fullname,
    //     updated_by: comment.users_comments_updated_byTousers
    //       ? comment.users_comments_updated_byTousers.fullname
    //       : "Chưa Cập Nhật",
    //   };
    //   delete formatComment.users_comments_updated_byTousers;
    //   delete formatComment.users_comments_created_byTousers;
    //   if (ListComments.length === 0) {
    //     return [];
    //   }
    //   return formatComment;
    // });
    return ListComments;
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
