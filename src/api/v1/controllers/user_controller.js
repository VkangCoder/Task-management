const { OK, CREATED } = require("../../../core/success.response.js");

const {
  getAllUsersService,
  getUsersByDepartmentId,
} = require("../services/user_service.js");
module.exports = {
  getAllUsersController: async (req, res, next) => {
    new OK({
      message: "Get All Users Succesful! : ",
      metadata: await getAllUsersService(req.query),
    }).send(res);
  },
  getAllUsersByDepartmentIdController: async (req, res, next) => {
    new OK({
      message: "Get All Users Succesful! : ",
      metadata: await getUsersByDepartmentId(req.query),
    }).send(res);
  },
  updateUserInfoByUserIdController: async (req, res, next) => {
    new OK({
      message: "Update Successful! : ",
      metadata: await getUsersByDepartmentId(req.query),
    }).send(res);
  },
};
