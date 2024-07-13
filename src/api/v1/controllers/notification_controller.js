const { OK, CREATED } = require("../../../core/success.response.js");
const {
  createNotificationService,
  getAllNotificationServiceByUserId,
} = require("../services/notification_service.js");

module.exports = {
  //   getAllNotificationsController: async (req, res, next) => {
  //     new OK({
  //       message: "Get All Notifications Succesful! : ",
  //       metadata: await getAllNotificationsService(req.query),
  //     }).send(res);
  //   },
  getAllNotificationsByUserIdController: async (req, res, next) => {
    const UserId = req.payload.userId;
    new OK({
      message: "Get All Notifications Succesful! : ",
      metadata: await getAllNotificationServiceByUserId(req.query, UserId),
    }).send(res);
  },
  createNotificationController: async (req, res, next) => {
    const UserId = req.payload.userId;
    new CREATED({
      message: "Create  Notification Succesful! : ",
      metadata: await createNotificationService(req.body, UserId),
    }).send(res);
  },
  // receiveNotificationController: async (req, res, next) => {
  //   const UserId = req.payload.userId;
  //   new OK({
  //     message: "Get All Notifications Succesful! : ",
  //     metadata: await getAllNotificationServiceByUserId(req.query, UserId),
  //   }).send(res);
  // },
};
