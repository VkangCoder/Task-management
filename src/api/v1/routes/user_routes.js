const express = require("express");

const { verifyAccessToken } = require("../services/jwt_service");
const {
  getAllUsersController,
  getAllUsersByDepartmentIdController,
} = require("../controllers/user_controller");
const asyncHandler = require("../../../middleware/handleError");
const UserRoutes = express.Router();

UserRoutes.get(
  "/getAllUsers",
  verifyAccessToken,
  asyncHandler(getAllUsersController)
);
UserRoutes.get(
  "/getAllUsersByDepartmentId",
  verifyAccessToken,
  asyncHandler(getAllUsersByDepartmentIdController)
);

module.exports = { UserRoutes };
