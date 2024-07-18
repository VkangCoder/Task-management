const express = require("express");
const AuthRoutes = express.Router();
const {
  AuthLoginController,
  AuthRegisterController,
  refreshTokenController,
} = require("../controllers/auth_controller");
const asyncHandler = require("../../../middleware/handleError");
const multer = require("multer");
const storage = multer.memoryStorage(); // Lưu file tạm thời trong bộ nhớ
const upload = multer({ storage: storage });
const { verifyAccessToken } = require("../services/jwt_service");
const { checkRolePermission } = require("../../../middleware/role_middleware");

AuthRoutes.post(
  "/register",
  verifyAccessToken,
  upload.single("user_img"),
  checkRolePermission("Create"),

  asyncHandler(AuthRegisterController)
);
AuthRoutes.post("/login", asyncHandler(AuthLoginController));
AuthRoutes.post("/refresh-token", asyncHandler(refreshTokenController));

module.exports = AuthRoutes;
