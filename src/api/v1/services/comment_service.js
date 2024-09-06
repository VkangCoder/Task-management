"use strict";
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
  validateParentComentId,
} = require("../../../middleware/validate/validateReferencer");
const { format } = require("date-fns");
const { createNotificationService } = require("./notification_service");
//hàm tìm max right của 1 comment
async function getMaxRight(prisma, taskId) {
  const maxRightResult = await prisma.comments.aggregate({
    where: { task_id: taskId },
    _max: { comment_right: true },
  });
  return maxRightResult._max.comment_right || 0; // Nếu null, giá trị mặc định là 0
}

//update lại các node khi có 1 comment mới xuất hiện
async function updateCommentTree(prisma, left, right) {
  await prisma.comments.updateMany({
    where: { comment_right: { gte: left } },
    data: { comment_right: { increment: 2 } },
  });
  await prisma.comments.updateMany({
    where: { comment_left: { gte: left } },
    data: { comment_left: { increment: 2 } },
  });
}
module.exports = {
  createCommentsService: async (Comments, userId) => {
    //Bước 1 check validate các trường tham chiếu ( khóa ngoiaj)

    await validatedReFTaskId(Comments.task_id);

    //Nếu có parent comment Id
    if (Comments.parent_comment_id) {
      await validateParentComentId(Comments.parent_comment_id);
    }
    //B2 : tạo transaction

    return await prisma.$transaction(async (prisma) => {
      let left, right;

      //nếu có truyền vào comment cha thì có nghĩa là comment này đang là phản hồi

      if (Comments.parent_comment_id) {
        //lấy ra giá trị right của comment cha

        const parentComment = await prisma.comments.findUnique({
          where: { id: Comments.parent_comment_id },
          select: { comment_right: true },
        });
        //comment mới dc tạo ra phải nằm giữa node left và right của comment cha
        // => ví dụ cha là 1,2 thì comment reply phải là 2,3 và comment cha tăng thành 1,4
        left = parentComment.comment_right;
        right = parentComment.comment_right + 1;
        // cập nhật toàn bộ giá trị left và right của tất cả comment khác
        // nếu nó lớn hơn comment node right của comment reply tăng lên 2

        //
        await updateCommentTree(prisma, left, right);

        await prisma.comments.update({
          where: { id: Comments.parent_comment_id },
          data: { comment_right: right + 1 },
        });
      } else {
        // Tạo bình luận gốc, tìm giá trị `right` lớn nhất hiện có
        const maxRight = await getMaxRight(prisma, Comments.task_id);

        left = maxRight + 1;
        right = maxRight + 2;
      }

      const newComment = await prisma.comments.create({
        data: {
          task_id: Comments.task_id,
          content: Comments.content,
          parent_comment_id: Comments.parent_comment_id,
          created_by: userId,
          created_at: new Date(),
          comment_left: left,
          comment_right: right,
        },
      });
      return newComment;
    });
  },
};
