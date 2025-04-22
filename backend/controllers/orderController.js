import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
// Global variables
// Dưới đây là danh sách các loại tiền tệ mà Stripe hỗ trợ (thường dùng nhất):

// 'usd' (Đô la Mỹ)

// 'eur' (Euro)

// 'gbp' (Bảng Anh)

// 'vnd' (Đồng Việt Nam)

// 'inr' (Rupee Ấn Độ)

// 'jpy' (Yên Nhật)

// 'aud' (Đô la Úc)

// 'cad' (Đô la Canada)
const currency = "usd";
const deliveryCharge = 10;
// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// Placing orders using COD Method
const placeOrder = async (req, res) => {
  try {
    // Lấy dữ liệu từ body của request (gửi từ frontend)
    const { userId, items, amount, address } = req.body;

    // Tạo đối tượng đơn hàng mới với dữ liệu từ người dùng
    const orderData = {
      userId, // ID người đặt hàng
      items, // Danh sách sản phẩm trong đơn hàng
      amount, // Tổng số tiền
      address, // Địa chỉ giao hàng
      paymentMethod: "COD", // Mặc định là thanh toán khi nhận hàng
      payment: false, // Chưa thanh toán (vì COD)
      date: Date.now(), // Thời gian đặt hàng (timestamp hiện tại)
    };

    // Khởi tạo một document mới từ model order
    const newOder = new orderModel(orderData);

    // Lưu đơn hàng vào database
    await newOder.save();

    // Sau khi đặt hàng xong, xóa dữ liệu giỏ hàng của user (reset về rỗng)

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // Phản hồi về client rằng đã đặt hàng thành công
    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    // Nếu có lỗi xảy ra, log lỗi và trả về thông báo lỗi
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Placing orders using Stripe Method
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body; // Lấy dữ liệu từ body của request
    const { origin } = req.headers; // Lấy origin (domain) của trang web từ header
    const orderData = {
      userId, // ID người đặt hàng
      items, // Danh sách sản phẩm trong đơn hàng
      amount, // Tổng số tiền
      address, // Địa chỉ giao hàng
      paymentMethod: "Stripe", // Mặc định là thanh toán qua Stripe
      payment: false, // Chưa thanh toán (vì đây là ví dụ về thanh toán qua Stripe)
      date: Date.now(), // Thời gian đặt hàng (timestamp hiện tại)
    };
    const newOrder = new orderModel(orderData); // Tạo đối tượng mới từ model order với dữ liệu trên
    await newOrder.save(); // Lưu đơn hàng mới vào cơ sở dữ liệu

    // Chuyển danh sách sản phẩm thành các "line items" tương ứng cho Stripe
    const line_items = items.map((item) => ({
      price_data: {
        currency: currency, // Tiền tệ (currency), bạn cần khai báo giá trị của biến này
        product_data: {
          name: `${item.name} x${item.quantity}`, // Tên sản phẩm
        },
        unit_amount: item.price * 100, // Giá trị sản phẩm (đơn vị là cent, vì Stripe sử dụng cent)
      },
      quantity: item.quantity, // Số lượng sản phẩm
    }));

    // Thêm phí vận chuyển vào danh sách line items
    line_items.push({
      price_data: {
        currency: currency, // Tiền tệ, cần khai báo giá trị biến này
        product_data: {
          name: "Delivery Charges x1", // Tên phí vận chuyển
        },
        unit_amount: deliveryCharge * 100, // Phí vận chuyển, bạn cần khai báo giá trị của `deliveryCharge`
      },
      quantity: 1, // Phí vận chuyển chỉ có 1
    });

    // Tạo một session thanh toán của Stripe
    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`, // URL khi thanh toán thành công
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`, // URL khi thanh toán bị hủy
      line_items, // Danh sách các mặt hàng cần thanh toán
      mode: "payment", // Chế độ thanh toán, ở đây là thanh toán một lần
    });

    // Trả về URL của session thanh toán để người dùng có thể tiếp tục thanh toán
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error); // In lỗi nếu có
    res.json({ success: false, message: error.message }); // Trả về thông báo lỗi
  }
};
// Verify Stripe
const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// All orders data for admin panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// User order Data for frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// Update order status from Admin Panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
export {
  placeOrder,
  placeOrderStripe,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
};
