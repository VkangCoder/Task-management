const express = require("express");
const {
  getAllTasksController,
  createTaskController,
  receiveTaskController,
} = require("../controllers/task_controller");
const { verifyAccessToken } = require("../services/jwt_service");
const asyncHandler = require("../../../middleware/handleError");
const { checkRolePermission } = require("../../../middleware/role_middleware");
const TaskRoutes = express.Router();

TaskRoutes.get(
  "/getAllTasks",
  verifyAccessToken,
  checkRolePermission("Read"),
  asyncHandler(getAllTasksController)
);
TaskRoutes.post(
  "/createTasks",
  verifyAccessToken,
  checkRolePermission("Create"),
  asyncHandler(createTaskController)
);
TaskRoutes.post(
  "/receiveTasks",
  verifyAccessToken,
  checkRolePermission("Update"),
  asyncHandler(receiveTaskController)
);

module.exports = { TaskRoutes };
