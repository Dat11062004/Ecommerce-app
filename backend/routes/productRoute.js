import express from "express";
import {
  listProducts,
  addProduct,
  removeProduct,
  singleProduct,
} from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";
const productRouter = express.Router();
// // Cấu hình middleware multer để xử lý upload nhiều trường ảnh khác nhau,
// mỗi trường (image1, image2, image3, image4) chỉ cho phép tối đa 1 file
// Mỗi trường sẽ dc upload tối đa 1 ảnh và mỗi trg sẽ là 1 mảng chứa đối tg lưu trữ các thông tin của file
// VD:
// {
//   image1: [ { ...thông tin file image1... } ],
//   image2: [ { ...thông tin file image2... } ],
//   image3: [ { ...thông tin file image3... } ],
//   image4: [ { ...thông tin file image4... } ]
// }
productRouter.post(
  "/add",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);
productRouter.post("/remove", adminAuth, removeProduct);
productRouter.post("/single", singleProduct);
productRouter.get("/list", listProducts);
export default productRouter;
