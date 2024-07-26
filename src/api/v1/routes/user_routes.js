const express = require("express");

const { verifyAccessToken } = require("../services/jwt_service");
const {
  getAllUsersController,
  getAllUsersByDepartmentIdController,
  updateUserInfoByUserIdController,
} = require("../controllers/user_controller");
const asyncHandler = require("../../../middleware/handleError");
const { checkRolePermission } = require("../../../middleware/role_middleware");
const UserRoutes = express.Router();

UserRoutes.get(
  "/getAllUsers",
  verifyAccessToken,
  checkRolePermission("Read"),
  asyncHandler(getAllUsersController)
);
UserRoutes.get(
  "/getAllUsersByDepartmentId",
  verifyAccessToken,
  asyncHandler(getAllUsersByDepartmentIdController)
);
UserRoutes.patch(
  "/updateUserInfo/:userId",
  verifyAccessToken,
  asyncHandler(updateUserInfoByUserIdController)
);

module.exports = { UserRoutes };
