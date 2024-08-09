"use strict";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../../../config/config_cloudinary");

//1. upload from url image

const uploadImageFromUrl = async () => {
  try {
    const urlImage =
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ly4nxlt3uvnn95";
    const folderName = "user/1",
      newFileName = "testdemo";
    const result = await cloudinary.uploader.upload(urlImage, {
      public_id: newFileName,
      folder: folderName,
    });
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error uploading image:: ", error);
  }
};
const uploadImageFromLocal = async (filePath, userId) => {
  let uploadResult;
  try {
    // Tải ảnh lên Cloudinary trước
    const folderPath = `image/${userId}`;
    const uniqueSuffix = Date.now();
    const avatarPublicId = `avatar-${uniqueSuffix}`;
    uploadResult = await cloudinary.uploader.upload(filePath, {
      public_id: avatarPublicId,
      folder: folderPath,
    });

    if (!uploadResult.secure_url) {
      throw new Error("Failed to upload image to Cloudinary");
    }
  } catch (error) {
    console.error("Error uploading image to Cloudinary: ", error);
    return {
      success: false,
      message: "Failed to upload image.",
    };
  }

  // Nếu tải ảnh thành công, tiếp tục cập nhật database trong một transaction
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const userUpdate = await prisma.users.update({
        where: { id: userId },
        data: { user_img: uploadResult.secure_url },
      });
      return userUpdate;
    });

    return {
      success: true,
      data: result,
      message: "Image uploaded and user updated successfully.",
    };
  } catch (error) {
    console.error(
      "Transaction failed when updating user in the database: ",
      error
    );
    // Có thể thêm bước xóa ảnh đã tải lên từ Cloudinary nếu cần
    return {
      success: false,
      message: "Image uploaded but failed to update user.",
    };
  }
};

module.exports = { uploadImageFromUrl, uploadImageFromLocal };
