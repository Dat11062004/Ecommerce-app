import React, { useContext, useEffect } from "react";
import { ShopContext } from "../content/ShopContext";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Verify = () => {
  const { navigate, token, setCartItems, backendURL } = useContext(ShopContext);
  //   	Hook của React Router để truy cập và thay đổi các query params trên URL
  const [searchParams, setSearchParams] = useSearchParams();
  //   lấy giá trị của tham số success từ URL hiện tại.
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const verifyPayment = async () => {
    try {
      if (!token) {
        return null;
      }
      const response = await axios.post(
        backendURL + "/api/order/verifyStripe",
        { success, orderId },
        { headers: { token } }
      );
      if (response.data.success) {
        setCartItems({});
        navigate("/orders");
      } else {
        navigate("/cart");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    verifyPayment();
  }, [token]);
  return <div></div>;
};

export default Verify;
