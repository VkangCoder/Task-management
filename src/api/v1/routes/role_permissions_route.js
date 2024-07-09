const express = require("express");

const { verifyAccessToken } = require("../services/jwt_service");
const asyncHandler = require("../../../middleware/handleError");
const {
  getAllRolePermissionsController,
  createRolePermissionsController,
} = require("../controllers/role_permission_controller");
const { checkRolePermission } = require("../../../middleware/role_middleware");

const RolePermissionRoutes = express.Router();

RolePermissionRoutes.get(
  "/getAllRolePermissions",
  verifyAccessToken,
  checkRolePermission("Read"),
  asyncHandler(getAllRolePermissionsController)
);
RolePermissionRoutes.post(
  "/createRolePermissions",
  verifyAccessToken,
  checkRolePermission("Create"),
  asyncHandler(createRolePermissionsController)
);
// RolePermissionRoutes.post(
//   "/receiveRolePermissions",
//   verifyAccessToken,
//   asyncHandler(receiveRolePermissionController)
// );

module.exports = { RolePermissionRoutes };
