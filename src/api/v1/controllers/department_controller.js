const { OK, CREATED } = require("../../../core/success.response.js");
const {
  getAllDepartmentsService,
  getAllListIdDepartmentsService,
} = require("../services/department_service.js");

module.exports = {
  getAllDepartmentsController: async (req, res, next) => {
    new OK({
      message: "Get All Department Succesful! : ",
      metadata: await getAllDepartmentsService(req.query),
    }).send(res);
  },
  getAllListIdDepartmentsController: async (req, res, next) => {
    new OK({
      message: "Get All List Id Department Succesful! : ",
      metadata: await getAllListIdDepartmentsService(req.query),
    }).send(res);
  },
};
