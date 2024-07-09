const express = require("express");
const {
  getAllTasksController,
  createTaskController,
  receiveTaskController,
} = require("../controllers/task_controller");
const { verifyAccessToken } = require("../services/jwt_service");
const asyncHandler = require("../../../middleware/handleError");
const TaskRoutes = express.Router();

TaskRoutes.get(
  "/getAllTasks",
  verifyAccessToken,
  asyncHandler(getAllTasksController)
);
TaskRoutes.post(
  "/createTasks",
  verifyAccessToken,
  asyncHandler(createTaskController)
);
TaskRoutes.post(
  "/receiveTasks",
  verifyAccessToken,
  asyncHandler(receiveTaskController)
);

module.exports = { TaskRoutes };
