const { OK, CREATED } = require("../../../core/success.response.js");
const {
  getAllTasksService,
  createTasksService,
} = require("../services/task_service.js");
module.exports = {
  getAllTasksController: async (req, res, next) => {
    new OK({
      message: "Get All Tasks Succesful! : ",
      metadata: await getAllTasksService(req.query),
    }).send(res);
  },
  createTaskController: async (req, res, next) => {
    const UserId = req.payload.userId;
    new OK({
      message: "Get All Tasks Succesful! : ",
      metadata: await createTasksService(req.body, UserId),
    }).send(res);
  },
};
