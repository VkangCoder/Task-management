const { OK, CREATED } = require("../../../core/success.response.js");
const {
  getAllRolesService,
  createRolesService,
} = require("../services/role_service.js");

module.exports = {
  getAllRolesController: async (req, res, next) => {
    new OK({
      message: "Get All Roles Succesful! : ",
      metadata: await getAllRolesService(req.query),
    }).send(res);
  },
  createRolesController: async (req, res, next) => {
    const UserId = req.payload.userId;
    new CREATED({
      message: "Get All Roles Succesful! : ",
      metadata: await createRolesService(req.body, UserId),
    }).send(res);
  },
};
