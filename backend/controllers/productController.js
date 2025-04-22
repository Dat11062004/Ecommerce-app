import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
// function for add product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;
    // Kiểm tra nếu trường 'image1','image2','image3','image4' tồn tại trong req.files thì lấy file đầu tiên, ngược lại trả về undefined
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];
    // Tạo mảng images chứa các ảnh đã được upload thành công (loại bỏ undefined nếu người dùng không upload đủ)
    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    // Upload từng ảnh lên Cloudinary và lấy về mảng URL của các ảnh đã upload
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        // Upload ảnh lên Cloudinary, sử dụng đường dẫn tạm thời (item.path)
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image", // Chỉ định loại tài nguyên là ảnh
        });

        // Trả về URL ảnh đã được lưu trữ trên Cloudinary
        return result.secure_url;
      })
    );
    // Tạo đối tượng productData chứa thông tin sản phẩm sẽ được lưu vào database
    const productData = {
      name, // Tên sản phẩm
      description, // Mô tả sản phẩm
      category, // Danh mục chính
      price: Number(price), // Giá sản phẩm (chuyển từ chuỗi sang kiểu số)
      subCategory, // Danh mục con
      bestseller: bestseller === "true" ? true : false, // Chuyển 'bestseller' từ chuỗi sang boolean
      sizes: JSON.parse(sizes), // Chuyển 'sizes' từ chuỗi JSON thành mảng/object thực tế
      image: imagesUrl, // Mảng URL các ảnh đã upload lên Cloudinary
      date: Date.now(), // Thời điểm hiện tại (timestamp) khi sản phẩm được tạo
    };
    // Thêm sản phẩm vào database và lưu lại
    const product = new productModel(productData);
    await product.save();
    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// function for list product
const listProducts = async (req, res) => {
  try {
    // Tìm tất cả các sản phẩm trong collection productModel (MongoDB)
    const products = await productModel.find({});

    // Trả về phản hồi JSON chứa danh sách sản phẩm và cờ success:true
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// function for removing product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// function for single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
export { listProducts, addProduct, removeProduct, singleProduct };
