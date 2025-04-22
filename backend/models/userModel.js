import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
  },
  { minimize: false }
);
// Mongoose mặc định sẽ loại bỏ (minimize) các object trống khi lưu vào DB.

// Ví dụ nếu bạn không set minimize: false, một object rỗng như {} sẽ bị loại bỏ → Không có cardData trong document.

// minimize: false giúp giữ lại cardData: {} ngay cả khi nó trống.
const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
