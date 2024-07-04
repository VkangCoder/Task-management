const express = require(express);
const AuthRoutes = express.Router();
const {
  AuthLoginController,
  AuthRegisterController,
  refreshTokenController,
} = require("../controllers/auth_controller");
AuthRoutes.post("/login", AuthLoginController);
module.exports = AuthRoutes;
