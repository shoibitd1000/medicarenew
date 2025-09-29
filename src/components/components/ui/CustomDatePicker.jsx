import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker = ({
  repClass,
  value,
  placeHolderText,
  handleDate,
  disabled = false,
  icon,
  id,
  required = false,
  disablePastDates = false, // ✅ new prop
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = !!value;

  return (
    <div className="relative w-full">
      <DatePicker
        id={id}
        selected={value}
        onChange={(date) => handleDate(date)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        dateFormat="dd/MM/yyyy"
        placeholderText={placeHolderText || " "}
        disabled={disabled}
        wrapperClassName="w-full"
        minDate={disablePastDates ? new Date() : null} 
        
        className={`peer w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${repClass}`}
      />

      {/* Floating Label */}
      <label
        htmlFor={id}
        className={`absolute left-3 px-1 bg-white transition-all duration-200
          ${hasValue || isFocused ? "-top-3 text-sm text-blue-600" : "top-2 text-gray-400 text-base"}
        `}
      >
        {placeHolderText}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {icon && (
        <div className="absolute right-3 top-1 -translate-y-1/2 text-gray-400 pointer-events-none">
          {icon}
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
