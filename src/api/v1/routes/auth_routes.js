const express = require("express");
const AuthRoutes = express.Router();
const {
  AuthLoginController,
  AuthRegisterController,
  refreshTokenController,
} = require("../controllers/auth_controller");
const asyncHandler = require("../../../middleware/handleError");
// const {
//   validateUserRegistration,
//   validateUserLogin,
// } = require("../../middleware/validatevalidateAuth/");

const { verifyAccessToken } = require("../../v1/services/jwt_service");

AuthRoutes.post(
  "/register",
  verifyAccessToken,

  // checkRolePermission("Create"),

  asyncHandler(AuthRegisterController)
);
AuthRoutes.post("/login", asyncHandler(AuthLoginController));
AuthRoutes.post("/refresh-token", asyncHandler(refreshTokenController));

module.exports = AuthRoutes;
