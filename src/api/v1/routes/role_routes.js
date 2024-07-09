const express = require("express");

const { verifyAccessToken } = require("../services/jwt_service");
const asyncHandler = require("../../../middleware/handleError");
const {
  getAllRolesController,
  createRolesController,
} = require("../controllers/role_controller");
const { checkRolePermission } = require("../../../middleware/role_middleware");
const RoleRoutes = express.Router();

RoleRoutes.get(
  "/getAllRoles",
  verifyAccessToken,
  checkRolePermission("Read"),
  asyncHandler(getAllRolesController)
);
RoleRoutes.post(
  "/createRoles",
  verifyAccessToken,
  asyncHandler(createRolesController)
);
// RoleRoutes.post(
//   "/receiveRoles",
//   verifyAccessToken,
//   asyncHandler(receiveRoleController)
// );

module.exports = { RoleRoutes };
