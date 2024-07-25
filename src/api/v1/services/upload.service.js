"use strict";

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
  try {

    const folderPath = `image/${userId}`; // Đường dẫn thư mục theo ID người dùng
    const uniqueSuffix = Date.now(); // Tạo suffix duy nhất bằng timestamp
    const avatarPublicId = `avatar-${uniqueSuffix}`; // Tạo public_id cho avatar
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: avatarPublicId,
      folder: folderPath,
    });

    return {
      image_url: result.secure_url,
      userId: userId,
    };
  } catch (error) {
    console.error("Error uploading image:: ", error);
  }
};
module.exports = { uploadImageFromUrl, uploadImageFromLocal };
