const {
  LoginUserService,
  refreshTokenService,
  RegisterUserSerivce,
} = require("../services/auth_service.js");
const { OK, CREATED } = require("../../../core/success.response.js");
module.exports = {
  AuthLoginController: async (req, res, next) => {
    new OK({
      message: "LOGIN OK!",
      metadata: await LoginUserService(req.body),
    }).send(res);
  },
  AuthRegisterController: async (req, res, next) => {
    const UserId = req.payload.userId;
    console.log(UserId);
    new CREATED({
      message: " Resgiter Succesfull",
      metadata: await RegisterUserSerivce(req.body, UserId),
    }).send(res);
  },
  refreshTokenController: async (req, res, next) => {
    new OK({
      message: "RefreshToken OK!",
      metadata: await refreshTokenService(req.headers.authorization),
    }).send(res);
  },
};
