"use-strict";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  BadRequestError,
  ConflictRequestError,
} = require("../../../core/error.response");
const { buildWhereClause } = require("../../../utils/searchUtils");
const { format } = require("date-fns");
module.exports = {
  createNotificationService: async (notiData, UserID) => {
    const notification = await prisma.notification.create({
      data: {
        noti_type: notiData.noti_type,
        noti_sender_id: UserID,
        noti_content: notiData.noti_content,
        noti_receive_id: notiData.noti_receive_id,
        notification_status_id: notiData.notification_status_id,
        status: true,
      },
    });
    return notification;
  },
  getAllNotificationServiceByUserId: async (queryParams, UserId) => {
    const { filterField, operator, value, page, limit, sortBy, sortOrder } =
      queryParams;

    const pageNum = parseInt(page) || 1; // Mặc định là trang 1 nếu không được cung cấp
    const pageSize = parseInt(limit) || 10; // Mặc định 10 sản phẩm mỗi trang nếu không được cung cấp
    const skip = (pageNum - 1) * pageSize;
    const where = await buildWhereClause({ filterField, operator, value });
    // sắp xếp sort by
    const orderBy = sortBy && sortOrder ? { [sortBy]: sortOrder } : {};

    if (UserId) {
      where.noti_receive_id = parseInt(UserId);
    }
    let Notification = await prisma.notification.findMany({
      skip: skip,
      take: pageSize,
      where,
      orderBy,
      include: {
        users_notification_noti_receive_idTousers: true,
        users_notification_noti_sender_idTousers: true,
        notification_status: true,
      },
    });
    Notification = Notification.map((noti) => {
      const formatNoti = {
        ...noti,
        created_at: format(new Date(noti.created_at), "yyyy-MM-dd "),
        noti_sender_id: noti.users_notification_noti_sender_idTousers.fullname,
        //current_status cần phải update theo thời gian thực
        notification_status_id: noti.notification_status.status_name,
        noti_receive_id:
          noti.users_notification_noti_receive_idTousers.fullname,
      };
      delete formatNoti.users_notification_noti_receive_idTousers;
      delete formatNoti.users_notification_noti_sender_idTousers;
      delete formatNoti.notification_status;

      return formatNoti;
    });
    if (Notification.length === 0) {
      return [];
    }
    return Notification;
  },
};
