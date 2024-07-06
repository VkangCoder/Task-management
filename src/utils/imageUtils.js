const multer = require("multer");
const path = require("path");

const utilsPath = path.join(__dirname, "/images");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, utilsPath); // Thư mục lưu trữ hình ảnh
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Đổi tên hình ảnh để tránh trùng lặp
  },
});
const upload = multer({ storage: storage });
module.exports = { upload }; // Export để sử dụng ở nơi khác
