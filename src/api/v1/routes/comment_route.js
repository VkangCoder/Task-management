const express = require("express");

const { verifyAccessToken } = require("../services/jwt_service");
const asyncHandler = require("../../../middleware/handleError");
const { checkRolePermission } = require("../../../middleware/role_middleware");

const comment_controller = require("../controllers/comment_controller");
const CommentRoutes = express.Router();

CommentRoutes.post(
  "/createComments",
  verifyAccessToken,
  checkRolePermission("Create"),
  asyncHandler(comment_controller.createComment)
);
CommentRoutes.get(
  "/getAllCommentByTaskId",
  verifyAccessToken,
  checkRolePermission("Read"),
  asyncHandler(comment_controller.getListCommentsByTaskId)
);

module.exports = { CommentRoutes };
