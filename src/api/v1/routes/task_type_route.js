const express = require("express");

const { verifyAccessToken } = require("../services/jwt_service");
const asyncHandler = require("../../../middleware/handleError");
const { checkRolePermission } = require("../../../middleware/role_middleware");
const {
  getAllTask_TypeController,
  getAllTask_TypeByUserIdController,
  createTask_TypeController,
} = require("../controllers/task_type_controller");

const TaskTypeRoutes = express.Router();

TaskTypeRoutes.get(
  "/getAllTask_Type",
  verifyAccessToken,
  //   checkRolePermission("Read"),
  asyncHandler(getAllTask_TypeController)
);
TaskTypeRoutes.get(
  "/getAllTask_TypeById",
  verifyAccessToken,
  //   checkRolePermission("Read"),
  asyncHandler(getAllTask_TypeByUserIdController)
);
TaskTypeRoutes.post(
  "/createTask_Type",
  verifyAccessToken,
  //   checkRolePermission("Create"),
  asyncHandler(createTask_TypeController)
);

module.exports = { TaskTypeRoutes };
