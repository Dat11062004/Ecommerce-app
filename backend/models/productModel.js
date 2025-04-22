import mongoose from "mongoose";
// định nghĩa cấu trúc (schema) của một sản phẩm trong database.
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: Array, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  sizes: { type: Array, required: true },
  bestseller: { type: Boolean },
  date: { type: Number, required: true },
});
// Tạo một Model tên là "product" dựa vào schema bạn vừa định nghĩa.
// mongoose.models là một object chứa tất cả các model đã tạo.

// Nếu "product" đã tồn tại → dùng lại (mongoose.models.product)

// Nếu chưa có → tạo mới (mongoose.model("product", productSchema))
const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);
export default productModel;
