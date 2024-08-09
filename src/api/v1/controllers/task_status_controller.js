const { OK, CREATED } = require("../../../core/success.response.js");
const {
  getAllTaskStatusByTaskIdService,
} = require("../services/task_status_service.js");

module.exports = {
  getAllTaskStatusByTaskIdController: async (req, res, next) => {
    new OK({
      message: "Get All TaskStatuss Succesful! : ",
      metadata: await getAllTaskStatusByTaskIdService(req.query),
    }).send(res);
  },
};
