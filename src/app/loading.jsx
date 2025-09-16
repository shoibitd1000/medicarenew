import React from "react";

const IsLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-200 px-5 py-2 z-50">
      <div className="border shadow-xl  rounded-md py-2 px-4 flex items-center justify-center bg-white">
        <div className=" font-semibold">Loading ....</div>
        <div className="w-10 h-10 border-5 border-blue-900 border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default IsLoader;



