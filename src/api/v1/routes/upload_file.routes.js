const express = require("express");

const { verifyAccessToken } = require("../services/jwt_service");
const asyncHandler = require("../../../middleware/handleError");
const { checkRolePermission } = require("../../../middleware/role_middleware");
const {
  uploadFileController,
  uploadFileFromLocalController,
} = require("../controllers/upload-file.controller");
const { uploadDisk } = require("../../../config/multer.config");
const FileRoutes = express.Router();

FileRoutes.post(
  "/uploadFile",
  verifyAccessToken,
  asyncHandler(uploadFileController)
);
FileRoutes.post(
  "/uploadLocalFile",
  uploadDisk.single("file"),
  verifyAccessToken,
  asyncHandler(uploadFileFromLocalController)
);

module.exports = { FileRoutes };
