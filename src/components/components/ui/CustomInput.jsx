import React from "react";

const CustomInput = ({
  value,
  onChange,
  placeholder,
  type = "text",
  leftIcon,
  repClass = "",
  id,
  required = false,
}) => {
  return (
    <div className="relative w-full">
      {/* Input */}
      <input
        id={id}
        type={type}
        required={required}
        className={`peer w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
          ${leftIcon ? "pl-10" : "pl-3"} pr-3 py-2 font-medium ${repClass}`}
        value={value}
        onChange={onChange}
        placeholder=" " // needed for floating effect
      />

      {/* Left Icon */}
      {leftIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {leftIcon}
        </div>
      )}

      {/* Floating Label */}
      <label
        htmlFor={id}
        className={`absolute bg-white px-1 transition-all duration-200 pointer-events-none
          ${leftIcon ? "left-10" : "left-3"}
          top-2 text-gray-400 text-base
          peer-placeholder-shown:top-2   peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
          peer-focus:-top-2 peer-focus:text-xs peer-focus:-left-[-20px] peer-focus:text-blue-600
          peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:-left-[-20px] peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-blue-600`}
      >
        
        {placeholder}
      </label>
    </div>
  );
};

export default CustomInput;
