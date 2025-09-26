import React from "react";
const IsLoader = ({ isFullScreen = true, text = "Loading ....", size = "10" }) => {
  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .custom-spin {
            animation: spin 1s linear infinite;
            border: 6px solid rgb(63 34 196 / 10%);
            border-top-color: transparent;
            border-radius: 50%;
          }
        `}
      </style>
      <div className={`${isFullScreen ? "fixed inset-0 flex items-center justify-center bg-slate-200 px-5 py-2 z-50" : "flex items-center justify-center"}`}>
        <div className={`${isFullScreen ? "" : ""} flex items-center gap-3 justify-center`}>
          <div className={`w-${size} h-${size} custom-spin`}></div>
          {/* <div className="font-semibold">{text}</div> */}
        </div>
      </div>
    </>
  );
};
export default IsLoader;