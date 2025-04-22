import userModel from "../models/userModel.js";

// add products to user cart
const addToCart = async (req, res) => {
  try {
    // Lấy userId, itemId và size từ request body
    const { userId, itemId, size } = req.body;
    console.log("Item ID:", itemId);
    // Tìm thông tin người dùng từ database theo userId
    const userData = await userModel.findById(userId);

    // Lấy dữ liệu giỏ hàng hiện tại từ userData (giả định cartData là 1 object lưu thông tin giỏ hàng)
    let cartData = await userData.cartData;

    // Kiểm tra xem trong giỏ hàng đã có sản phẩm với itemId này chưa
    if (cartData[itemId]) {
      // Nếu có sản phẩm đó rồi, kiểm tra xem đã có size tương ứng chưa
      if (cartData[itemId][size]) {
        // Nếu đã có size, tăng số lượng lên 1
        cartData[itemId][size] += 1;
      } else {
        // Nếu chưa có size, thêm size đó với số lượng là 1
        cartData[itemId][size] = 1;
      }
    } else {
      // Nếu chưa có sản phẩm itemId đó trong giỏ hàng, tạo mới sản phẩm với size và số lượng là 1
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    // Cập nhật lại dữ liệu giỏ hàng mới vào database
    await userModel.findByIdAndUpdate(userId, { cartData });

    // Trả về phản hồi thành công
    res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    // Nếu xảy ra lỗi, in ra console và trả về phản hồi lỗi
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update user cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;
    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;
    cartData[itemId][size] = quantity;
    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// get user cart item
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;
    res.json({ success: true, cartData: cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
export { addToCart, updateCart, getUserCart };
