const express = require("express");

const { verifyAccessToken } = require("../services/jwt_service");
const {
  getAllDepartmentsController,
  getAllListIdDepartmentsController,
  postCreateDepartmentsController,
} = require("../controllers/department_controller");
const asyncHandler = require("../../../middleware/handleError");
const { checkRolePermission } = require("../../../middleware/role_middleware");
const DepartmentsRoutes = express.Router();

DepartmentsRoutes.get(
  "/getAllDepartments",
  verifyAccessToken,
  asyncHandler(getAllDepartmentsController)
);
DepartmentsRoutes.get(
  "/getAllListIdDepartments",
  verifyAccessToken,
  checkRolePermission("Read"),
  asyncHandler(getAllListIdDepartmentsController)
);
DepartmentsRoutes.post(
  "/createDepartment",
  verifyAccessToken,
  asyncHandler(postCreateDepartmentsController)
);

module.exports = { DepartmentsRoutes };
