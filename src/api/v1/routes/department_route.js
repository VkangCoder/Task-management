const express = require("express");

const { verifyAccessToken } = require("../services/jwt_service");
const {
  getAllDepartmentsController,
  getAllListIdDepartmentsController,
} = require("../controllers/department_controller");
const asyncHandler = require("../../../middleware/handleError");
const DepartmentsRoutes = express.Router();

DepartmentsRoutes.get(
  "/getAllDepartments",
  verifyAccessToken,
  asyncHandler(getAllDepartmentsController)
);
DepartmentsRoutes.get(
  "/getAllListIdDepartments",
  verifyAccessToken,
  asyncHandler(getAllListIdDepartmentsController)
);
module.exports = { DepartmentsRoutes };
