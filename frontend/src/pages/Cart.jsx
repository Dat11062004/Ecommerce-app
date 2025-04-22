import React, { useState, useContext, useEffect } from "react";
import { ShopContext } from "../content/ShopContext";
import { Title } from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } =
    useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  useEffect(() => {
    // ⚠️ Chỉ thực hiện xử lý khi danh sách sản phẩm đã có dữ liệu
    // Nếu products vẫn là mảng rỗng thì chưa có dữ liệu sản phẩm để xử lý giỏ hàng
    // Vì khi reload lại trang cart products sẽ mất 1 khoảng tgian để call api lấy đầy đủ dữ liệu products
    // Nên cần theo dõi products khi có độ dài >0 thì ms thực hiện effect tránh phần dưới so sánh id để lấy ra sản phẩm bị rỗng
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const size in cartItems[items]) {
          if (cartItems[items][size] > 0) {
            tempData.push({
              _id: items,
              size: size,
              quantity: cartItems[items][size],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);
  return (
    <div className="border-t pt-14">
      <div className="text-start text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>
      {/* Phần hiển thị các sản phẩm đã thêm vào giỏ hàng  */}
      <div>
        {cartData.map((item, index) => {
          let productData = products.find(
            (product) => product._id === item._id
          );
          return (
            <div
              key={index}
              className="py-4 border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              {/* Phần ngoài cùng bên trái */}
              <div className="flex items-start gap-6">
                <img
                  className="w-16 sm:w-20"
                  src={productData.image[0]}
                  alt=""
                />
                <div>
                  <p className="text-xs sm:text-lg font-medium">
                    {productData.name}
                  </p>
                  <div className="flex items-center gap-5 mt-2">
                    <p>
                      {currency}
                      {productData.price}
                    </p>
                    <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>
              {/* Phần giữa */}
              <input
                onChange={(e) =>
                  e.target.value === "" || e.target.value === "0"
                    ? null
                    : updateQuantity(
                        item._id,
                        item.size,
                        Number(e.target.value)
                      )
                }
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                type="number"
                min={1}
                defaultValue={item.quantity}
              />
              {/* Phần ngoài cùng bên phải */}
              <img
                onClick={() => updateQuantity(item._id, item.size, 0)}
                className="w-4 m-4 cursor-pointer"
                src={assets.bin_icon}
                alt=""
              />
            </div>
          );
        })}
      </div>
      {/* Total */}
      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              onClick={() => navigate("/place-order")}
              className="bg-black text-white text-sm my-8 px-8 py-3 hover:bg-red-700 transition-all  ease-in-out duration-500"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
