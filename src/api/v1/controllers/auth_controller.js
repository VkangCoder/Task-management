const {
  RegisterUserService,
  LoginUserService,
  refreshTokenService,
} = require("../services/auth_service.js");
const { OK, CREATED } = require("../../../core/success.response.js");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
module.exports = {
  AuthLoginController: async (req, res, next) => {
    new OK({
      message: "LOGIN OK!",
      metadata: await LoginUserService(req.body),
    }).send(res);
  },
  AuthRegisterController: async (req, res, next) => {
    const UserId = req.payload.userId;
    const file = req.file;
    console.log(req.body);
    console.log(file);
    new CREATED({
      message: "Register OK!",
      metadata: await RegisterUserService(req.body, UserId, file),
    }).send(res);
  },
  refreshTokenController: async (req, res, next) => {
    new OK({
      message: "RefreshToken OK!",
      metadata: await refreshTokenService(req.headers.authorization),
    }).send(res);
  },
};
