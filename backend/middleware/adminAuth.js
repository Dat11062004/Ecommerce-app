import jwt from "jsonwebtoken";

// Middleware kiểm tra quyền truy cập admin
const adminAuth = async (req, res, next) => {
  try {
    // Lấy token từ header của yêu cầu
    const { token } = req.headers;

    // Nếu không có token trong header, trả về thông báo lỗi
    if (!token) {
      return res.json({
        success: false, // Trả về kết quả không thành công
        message: "Not Authorized Login Again!", // Thông báo người dùng không được phép truy cập
      });
    }

    // Giải mã token bằng secret key từ .env (môi trường)
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    // Kiểm tra xem token có hợp lệ hay không (so với thông tin admin trong môi trường)
    if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.json({
        success: false, // Trả về kết quả không thành công
        message: "Not Authorized Login Again!", // Thông báo không đủ quyền truy cập
      });
    }

    // Nếu token hợp lệ, tiếp tục xử lý request (next() sẽ gọi middleware hoặc route tiếp theo)
    next();
  } catch (error) {
    console.log(error); // In ra lỗi trong quá trình kiểm tra token
    res.json({ success: false, message: error.message }); // Trả về lỗi nếu có vấn đề trong việc giải mã token
  }
};

export default adminAuth; // Xuất middleware này để sử dụng ở các route cần bảo vệ
