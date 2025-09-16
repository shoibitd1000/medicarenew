import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const notify = (message, type = "success") => {
  if (type === "success") {
    toast.success(message, { autoClose: 3000 });
  } else if (type === "warn") {
    toast.warn(message, { autoClose: 3000 });
  } else if (type === "error") {
    toast.error(message, { autoClose: 3000 });
  } else {
    toast.info(message, { autoClose: 3000 });
  }
};

export default function Toaster() {
  return (
    <ToastContainer
      autoClose={1000}
      draggable={false}
      position="top-right"
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnHover
      className="text-xs"
    />
  );
}
