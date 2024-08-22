const express = require("express");

const { verifyAccessToken } = require("../services/jwt_service");
const asyncHandler = require("../../../middleware/handleError");
const { checkRolePermission } = require("../../../middleware/role_middleware");
const {
  getAllCommentsController,
  createCommentController,
} = require("../controllers/comment_controller");
const CommentRoutes = express.Router();

CommentRoutes.get(
  "/getAllComments",
  verifyAccessToken,
  //   checkRolePermission("Read"),
  asyncHandler(getAllCommentsController)
);

CommentRoutes.post(
  "/createComments",
  verifyAccessToken,
  checkRolePermission("Create"),
  asyncHandler(createCommentController)
);

module.exports = { CommentRoutes };
