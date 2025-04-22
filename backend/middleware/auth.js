import jwt from "jsonwebtoken";
// Middleware kiểm tra người dùng đã đăng nhập hay chưa
const authUser = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({
      success: false,
      message: "Not Authorized Login Again!",
    });
  }
  try {
    // Giải mã token với secret key (lưu trong biến môi trường)
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    // Gán userId (lấy từ token) vào req.body để dùng ở các middleware hoặc route tiếp theo
    req.body.userId = token_decode.id;
    // Cho phép tiếp tục thực hiện các middleware/route tiếp theo
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
export default authUser;
