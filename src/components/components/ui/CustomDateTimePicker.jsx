import React, { useState } from "react";
import { format } from "date-fns";

const CustomDateTimeInput = ({ label, value, onChange, required = false, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = !!value;

  return (
    <div className="relative w-full">
      <input
        type="datetime-local"
        className="peer border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value ? format(value, "yyyy-MM-dd'T'HH:mm") : ""}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : null)}
        {...props}
        placeholder=" " // 👈 triggers peer-placeholder-shown for label animation
      />

      {/* Floating Label */}
      {label && (
        <label
          className={`absolute left-3 px-1 bg-white transition-all duration-200
            ${hasValue || isFocused ? "-top-3 text-sm text-blue-600" : "top-2 text-gray-400 text-base"}
          `}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
    </div>
  );
};

export default CustomDateTimeInput;

