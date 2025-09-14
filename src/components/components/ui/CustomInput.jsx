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
        type="text"
        className={`peer w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
      ${leftIcon ? "pl-10" : "pl-3"} pr-3 py-2 font-medium ${repClass}`}
        placeholder=" "
        value={value}
        onChange={onChange}
      />

      {/* Left Icon */}
      {leftIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {leftIcon}
        </div>
      )}

      {/* Floating Label */}
      <label
        htmlFor={id}
        className={`absolute transition-all duration-200 bg-white
    ${leftIcon ? "left-10" : "left-3"}
    ${value ? "-top-3 text-sm text-blue-600" : "top-2 text-gray-400 text-base"}
    peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-600 peer-focus:left-3`}
      >
        {placeholder}
      </label>

    </div>

  );
};

export default CustomInput;
