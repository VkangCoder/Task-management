const express = require("express");
const {
  getAllTasksController,
  createTaskController,
  receiveTaskController,
} = require("../controllers/task_controller");
const { verifyAccessToken } = require("../services/jwt_service");
const TaskRoutes = express.Router();

TaskRoutes.get("/getAllTasks", verifyAccessToken, getAllTasksController);
TaskRoutes.post("/createTasks", verifyAccessToken, createTaskController);
TaskRoutes.post("/receiveTasks", verifyAccessToken, receiveTaskController);

module.exports = { TaskRoutes };
