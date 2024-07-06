const { PrismaClient } = require("@prisma/client");
const { NotFoundError } = require("../../core/error.response");

const prisma = new PrismaClient();
module.exports = {
  validatedUserId: async (id) => {
    const userExists = await prisma.users.findUnique({
      where: { id: id },
      select: {
        id: true,
      },
    });
    if (!userExists) {
      throw new NotFoundError("Id Người cần cập nhật không tồn tại");
    }
  },
  validateRefFloor: async (id) => {
    const isExistFloor = await prisma.floors.findUnique({
      where: { id: id },
      select: {
        id: true,
      },
    });
    if (!isExistFloor) {
      throw new NotFoundError("Id Floor không tồn tại ");
    }
  },
  validateRefTable: async (id) => {
    const isExistFloor = await prisma.tables.findUnique({
      where: { id: id },
      select: {
        id: true,
      },
    });
    if (!isExistFloor) {
      throw new NotFoundError("Id Table không tồn tại ");
    }
  },
  validateRefFranchise: async (id) => {
    const isExistFloor = await prisma.franchise.findUnique({
      where: { id: id },
      select: {
        id: true,
      },
    });
    if (!isExistFloor) {
      throw new NotFoundError("Id Chi Nhánh không tồn tại ");
    }
  },
  validateRefCatalogue: async (id) => {
    const isExistCatalogue = await prisma.catalogue.findUnique({
      where: { id: id },
      select: {
        id: true,
      },
    });
    if (!isExistCatalogue) {
      throw new NotFoundError("Id Catalogue không tồn tại ");
    }
  },
  validateRefProduct: async (id) => {
    const isExistProduct = await prisma.products.findUnique({
      where: { id: id },
      select: {
        id: true,
      },
    });
    if (!isExistProduct) {
      throw new NotFoundError("Id Sản Phẩm  không tồn tại ");
    }
  },
  validateRefMenuProduct: async (id) => {
    const isExistMenuProduct = await prisma.menu_products.findUnique({
      where: { id: id },
      select: {
        id: true,
      },
    });
    if (!isExistMenuProduct) {
      throw new NotFoundError("Id Menu Product không tồn tại ");
    }
  },
  validateRefRole: async (id) => {
    const isExistFloor = await prisma.role.findUnique({
      where: { id: id },
      select: {
        id: true,
      },
    });
    if (!isExistFloor) {
      throw new NotFoundError("Id Floor không tồn tại ");
    }
  },
  validateRefRolePermission: async (id) => {
    const isExistFloor = await prisma.role_permissions.findUnique({
      where: { id: id },
      select: {
        id: true,
      },
    });
    if (!isExistFloor) {
      throw new NotFoundError("Id Role Permission không tồn tại ");
    }
    return isExistFloor;
  },
  validateRefPaymentMethod: async (id) => {
    const isExistFloor = await prisma.payment_method.findUnique({
      where: { id: id },
      select: {
        id: true,
      },
    });
    if (!isExistFloor) {
      throw new NotFoundError("Payment method ID không tồn tại ");
    }
    return isExistFloor;
  },
  validateRefOrder: async (id) => {
    const isExistFloor = await prisma.orders.findUnique({
      where: { id: id },
      select: {
        id: true,
      },
    });
    if (!isExistFloor) {
      throw new NotFoundError("Order ID không tồn tại ");
    }
    return isExistFloor;
  },
  validateRefMenuRole: async (id) => {
    const isExistFloor = await prisma.menu_role.findUnique({
      where: { id: id },
      select: {
        id: true,
      },
    });
    if (!isExistFloor) {
      throw new NotFoundError("MenuRole ID không tồn tại ");
    }
    return isExistFloor;
  },
  validateRefOrderDetails: async (id) => {
    const isExistFloor = await prisma.orders_detail.findUnique({
      where: { id: id },
      select: {
        id: true,
      },
    });
    if (!isExistFloor) {
      throw new NotFoundError("OrderDetails ID không tồn tại ");
    }
    return isExistFloor;
  },
  validateRefQRRole: async (id) => {
    const isExistFloor = await prisma.qr_role.findUnique({
      where: { id: id },
      select: {
        id: true,
      },
    });
    if (!isExistFloor) {
      throw new NotFoundError("QRRole ID không tồn tại ");
    }
    return isExistFloor;
  },
  validateRefQR: async (id) => {
    const isExistFloor = await prisma.qr.findUnique({
      where: { id: id },
      select: {
        id: true,
      },
    });
    if (!isExistFloor) {
      throw new NotFoundError("QR ID không tồn tại ");
    }
    return isExistFloor;
  },
};
