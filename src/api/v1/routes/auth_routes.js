const express = require(express);
const AuthRoutes = express.Router();
const asyncHandler = require("../../../middleware/handleError");
const {
  AuthLoginController,
  AuthRegisterController,
  refreshTokenController,
} = require("../controllers/auth_controller");
AuthRoutes.post("/login", asyncHandler(AuthLoginController));
module.exports = AuthRoutes;
