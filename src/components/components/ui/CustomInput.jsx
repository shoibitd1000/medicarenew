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
      {/* Left icon */}
      {leftIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {leftIcon}
        </div>
      )}

      {/* Input field */}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
          ${leftIcon ? "pl-10" : "pl-3"} pr-3 py-2 font-medium ${repClass}`}
      />
    </div>
  );
};

export default CustomInput;
