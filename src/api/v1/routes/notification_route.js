const express = require("express");

const { verifyAccessToken } = require("../services/jwt_service");
const asyncHandler = require("../../../middleware/handleError");
const { checkRolePermission } = require("../../../middleware/role_middleware");
const {
  createNotificationController,
  getAllNotificationsByUserIdController,
} = require("../controllers/notification_controller");
const NotificationRoutes = express.Router();

// NotificationRoutes.get(
//   "/getAllNotifications",
//   verifyAccessToken,
//   checkRolePermission("Read"),
//   asyncHandler(getAllNotificationsController)
// );
NotificationRoutes.get(
  "/getAllNotificationsById",
  verifyAccessToken,
  checkRolePermission("Read"),
  asyncHandler(getAllNotificationsByUserIdController)
);
NotificationRoutes.post(
  "/createNotifications",
  verifyAccessToken,
  checkRolePermission("Create"),
  asyncHandler(createNotificationController)
);
// NotificationRoutes.post(
//   "/receiveNotifications",
//   verifyAccessToken,
//   checkRolePermission("Update"),
//   asyncHandler(receiveNotificationController)
// );

module.exports = { NotificationRoutes };
