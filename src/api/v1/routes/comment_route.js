const express = require("express");

const { verifyAccessToken } = require("../services/jwt_service");
const asyncHandler = require("../../../middleware/handleError");
const { checkRolePermission } = require("../../../middleware/role_middleware");
const {
  getAllCommentsByTaskIdController,
  createCommentController,
} = require("../controllers/comment_controller");
const comment_controller = require("../controllers/comment_controller");
const CommentRoutes = express.Router();

CommentRoutes.get(
  "/getAllCommentByTaskId",
  verifyAccessToken,
  checkRolePermission("Read"),
  asyncHandler(getAllCommentsByTaskIdController)
);

CommentRoutes.post(
  "/createComments",
  verifyAccessToken,
  checkRolePermission("Create"),
  asyncHandler(comment_controller.createComment)
);

module.exports = { CommentRoutes };
