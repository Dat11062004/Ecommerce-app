import React, { useEffect } from "react";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add";
import Orders from "./pages/Orders";
import List from "./pages/List";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const currency = "$";
// Lấy URL backend từ biến môi trường Vite để sử dụng trong các request API
export const backendUrl = import.meta.env.VITE_BACKEND_URL;
const App = () => {
  // Lấy token từ localStorage khi login thành công, nếu không có sẽ là một chuỗi rỗng.
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // useEffect để theo dõi sự thay đổi của `token` và lưu vào localStorage.
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]); // Chạy lại mỗi khi `token` thay đổi.
  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
