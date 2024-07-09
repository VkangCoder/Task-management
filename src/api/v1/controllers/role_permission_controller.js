const { OK, CREATED } = require("../../../core/success.response.js");
const {
  getAllListIdRolePermissionsService,
  getAllRolePermissionsService,
  createRolePermissionsService,
} = require("../services/role_permission_service.js");

module.exports = {
  getAllRolePermissionsController: async (req, res, next) => {
    new OK({
      message: "Get All RolePermissions Succesful! : ",
      metadata: await getAllRolePermissionsService(req.query),
    }).send(res);
  },
  createRolePermissionsController: async (req, res, next) => {
    const UserId = req.payload.userId;
    new CREATED({
      message: "Get All RolePermissions Succesful! : ",
      metadata: await createRolePermissionsService(req.body, UserId),
    }).send(res);
  },
};
