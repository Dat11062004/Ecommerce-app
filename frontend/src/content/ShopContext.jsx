import { createContext, useEffect, useState } from "react";
// import { products } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export const ShopContext = createContext();
const ShopContextProvider = (props) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  console.log(backendURL);
  const currency = "$";
  const delivery_fee = 10;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  // Thêm sản phẩm vào giỏ hàng
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }
    // structuredClone(cartItems): Tạo một bản sao sâu (deep copy) của cartItems để tránh sửa trực tiếp state (vì React yêu cầu state phải bất biến).
    let cartData = structuredClone(cartItems);
    // Ktra xem sản phẩm có itemId đã có trong giỏ hàng chưa
    if (cartData[itemId]) {
      // Nếu có rồi mà lại trùng size thì tăng số lg đặt hàng theo size thêm 1
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      }
      // Ngược lại có rồi mà size khác vẫn giữ nguyên số lg theo size = 1
      else {
        cartData[itemId][size] = 1;
      }
      // Ngược lại nếu chưa có sản phẩm nào có itemId dc thêm vào giỏ thì sẽ tạo 1 đối tg mới theo itemId và gán số lượng theo size đã chọn =1
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);
    // Sau khi thêm sản phẩm chọn vào giỏ hàng hiển thị trên frontend sẽ truyền data đó vào backend qua itemId và size
    if (token) {
      try {
        await axios.post(
          backendURL + "/api/cart/add",
          { itemId, size },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };
  // Lấy ra số lượng sản phẩm đã thêm vào giỏ hàng
  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const size in cartItems[items]) {
        try {
          if (cartItems[items][size] > 0) {
            totalCount += cartItems[items][size];
          }
        } catch (error) {}
      }
    }
    return totalCount;
  };
  // Update giỏ hàng
  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
    if (token) {
      try {
        await axios.post(
          backendURL + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };
  // Tính tổng số  tiền trong giỏ hàng
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const size in cartItems[items]) {
        try {
          if (cartItems[items][size] > 0) {
            totalAmount += itemInfo.price * cartItems[items][size];
          }
        } catch (error) {}
      }
    }
    return totalAmount;
  };
  // Call Api lấy ra các sản phẩm trong database
  const getProductsData = async () => {
    try {
      const response = await axios.get(backendURL + "/api/product/list");
      console.log(backendURL);
      console.log("API Response:", response.data);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  // call api để lấy dữ liệu sản phẩm người dùng đã thêm vào giỏ hàng
  const getUserCart = async (token) => {
    try {
      // Đây là phần 'data' (request body), hiện tại không gửi gì nên để trống {}
      const response = await axios.post(
        backendURL + "/api/cart/get",
        {},
        {
          headers: { token },
        }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    getProductsData();
  }, []);
  // Vì khi f5 state token trở về rỗng nên sẽ bị đăng nhập lại
  // Nếu state 'token' chưa có giá trị
  // nhưng trong localStorage lại đang lưu token
  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      // => Gán lại token từ localStorage vào state
      setToken(localStorage.getItem("token"));
      // Sau khi đăng nhập lại lại chạy lại hàm getUserCart để lấy số sản phẩm giỏ hàng trong database
      getUserCart(localStorage.getItem("token"));
    }
  }, []);
  // Giá trị muốn chia sẻ cho các component con
  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendURL,
    token,
    setToken,
  };
  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};
export default ShopContextProvider;
