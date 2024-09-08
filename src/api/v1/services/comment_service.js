"use strict";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  BadRequestError,
  ConflictRequestError,
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

//update lại các node khi có 1 comment mới xuất hiện
async function insertNestedComment(
  prisma,
  task_id,
  userId,
  content,
  parentCommentId
) {
  const parentComment = await prisma.comments.findUnique({
    where: { id: parentCommentId },
    select: { comment_right: true },
  });

  const right = parentComment.comment_right;
  const left = right; // Comment mới sẽ nằm ngay sau parent comment

  // Cập nhật các giá trị comment_right và comment_left của các comment hiện có
  await prisma.comments.updateMany({
    where: {
      OR: [{ comment_right: { gte: right } }, { comment_left: { gte: left } }],
    },
    data: {
      comment_right: { increment: 2 },
      comment_left: { increment: 2 },
    },
  });

  // Tạo comment mới
  return prisma.comments.create({
    data: {
      task_id: task_id,
      content: content,
      parent_comment_id: parentCommentId,
      created_by: userId,
      comment_right: right + 1,
      comment_left: left,
    },
  });
}
class CommentService {
  constructor(prisma) {
    this.prisma = prisma;
  }
  static async createComment(CommentData, userId) {
    let rightValue;
    if (CommentData.parent_comment_id) {
      //reply comment
      //lấy ra giá trị right của comment cha
      await validateParentComentId(CommentData.parent_comment_id);

      return await insertNestedComment(
        prisma,
        CommentData.task_id,
        userId,
        CommentData.content,
        CommentData.parent_comment_id
      );
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
}

module.exports = CommentService;
//   getCommentInTaskService: async (queryParams) => {
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
