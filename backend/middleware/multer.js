import multer from "multer";
// Cấu hình nơi lưu trữ file (storage)
// Ở đây chỉ định tên file sẽ giữ nguyên tên gốc (originalname)
const storage = multer.diskStorage({
  // Đặt tên file khi lưu vào ổ đĩa
  filename: function (req, file, callback) {
    // Giữ nguyên tên gốc của file khi lưu
    callback(null, file.originalname);
  },
});
// Khởi tạo middleware upload với cấu hình storage ở trên
const upload = multer({ storage });
export default upload;
