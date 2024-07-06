const express = require("express");
const {
  getAllTasksController,
  createTaskController,
} = require("../controllers/task_controller");
const { verifyAccessToken } = require("../services/jwt_service");
const TaskRoutes = express.Router();

TaskRoutes.get("/getAllTasks", verifyAccessToken, getAllTasksController);
TaskRoutes.post("/createTasks", verifyAccessToken, createTaskController);

module.exports = { TaskRoutes };
