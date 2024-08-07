const { OK, CREATED } = require("../../../core/success.response.js");
const {
  createTask_TypeService,
  getAllTask_TypeService,
} = require("../services/task_type_service.js");

module.exports = {
  getAllTask_TypeController: async (req, res, next) => {
    new OK({
      message: "Get All Task_Type Succesful! : ",
      metadata: await getAllTask_TypeService(req.query),
    }).send(res);
  },
  getAllTask_TypeByUserIdController: async (req, res, next) => {
    const UserId = req.payload.userId;
    new OK({
      message: "Get All Task Type Succesful! : ",
      metadata: await getAllTask_TypeServiceByUserId(req.query, UserId),
    }).send(res);
  },
  createTask_TypeController: async (req, res, next) => {
    const UserId = req.payload.userId;

    try {
      new CREATED({
        message: "Create  Task Type Succesful! : ",
        metadata: await createTask_TypeService(req.body, UserId),
      }).send(res);
    } catch (error) {
      throw error;
    }
  },
};
