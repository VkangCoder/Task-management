const bucket = require("../firebase/firebaseAdminconfig");

async function uploadFileToStorage(file, destination) {
  const fileRef = bucket.file(destination || file.originalname);

  // Lưu file vào Firebase Storage
  await fileRef.save(file.buffer, {
    metadata: { contentType: file.mimetype },
  });

  // Đặt file là công khai
  await fileRef.makePublic();

  // Tạo URL có thể truy cập công khai
  const [url] = await fileRef.getSignedUrl({
    action: "read",
    expires: "03-09-2025", // Bạn có thể đặt ngày hết hạn rất xa vào tương lai để nó giống như là công khai vĩnh viễn
  });

  return url;
}

module.exports = { uploadFileToStorage };
