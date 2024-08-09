const express = require("express");

const { verifyAccessToken } = require("../services/jwt_service");
const asyncHandler = require("../../../middleware/handleError");
const { checkRolePermission } = require("../../../middleware/role_middleware");
const {
  getAllTaskStatusByTaskIdController,
} = require("../controllers/task_status_controller");
const TaskStatusRoutes = express.Router();

TaskStatusRoutes.get(
  "/getAllTaskStatuss",
  verifyAccessToken,
  checkRolePermission("Read"),
  asyncHandler(getAllTaskStatusByTaskIdController)
);

module.exports = { TaskStatusRoutes };
