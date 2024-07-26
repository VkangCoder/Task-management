const express = require("express");
const AuthRoutes = express.Router();
const {
  AuthLoginController,
  AuthRegisterController,
  refreshTokenController,
} = require("../controllers/auth_controller");
const asyncHandler = require("../../../middleware/handleError");

const { verifyAccessToken } = require("../services/jwt_service");
const { checkRolePermission } = require("../../../middleware/role_middleware");

AuthRoutes.post("/login", asyncHandler(AuthLoginController));
AuthRoutes.post("/refresh-token", asyncHandler(refreshTokenController));
AuthRoutes.post(
  "/register",
  verifyAccessToken,
   asyncHandler(AuthRegisterController)
);
module.exports = AuthRoutes;
