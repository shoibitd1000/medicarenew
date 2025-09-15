    import React from "react";

const IsLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-500 px-5 py-2 z-50">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
    </div>
  );
};

export default IsLoader;
