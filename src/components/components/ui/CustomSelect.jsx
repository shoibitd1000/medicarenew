import React, { useState } from "react";
import Select from "react-select";

const CustomSelect = ({
  options = [],   // raw API data
  value,
  onChange,
  placeholder,
  id,
  required,
  valueKey = "ID",       // API key for value
  labelKey = "doctorname" // API key for label
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = !!value;

  // map raw API data → react-select options
  const formattedOptions = options.map((item) => ({
    value: item[valueKey],
    label: item[labelKey],
    ...item, // keep the full object in case you need it later
  }));

  return (
    <div className="relative w-full">
      <Select
        id={id}
        options={formattedOptions}
        value={value}
        onChange={onChange}
        placeholder=" " 
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        isSearchable
        className="w-full"
        classNamePrefix="custom-select"
        styles={{
          control: (base, state) => ({
            ...base,
            borderRadius: "0.5rem",
            borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
            boxShadow: state.isFocused ? "0 0 0 2px #93c5fd" : "none",
            "&:hover": { borderColor: "#3b82f6" },
            padding: "2px 4px",
          }),
          placeholder: (base) => ({ ...base, color: "#9ca3af" }),
          menu: (base) => ({
            ...base,
            borderRadius: "0.5rem",
            marginTop: "4px",
            zIndex: 50,
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? "#e5e7eb" : "white",
            color: "#111827",
            "&:active": { backgroundColor: "#bfdbfe" },
          }),
        }}
      />

      {/* Floating Label */}
      <label
        htmlFor={id}
        className={`absolute left-3 px-1 bg-white transition-all duration-200
          ${hasValue || isFocused ? "-top-3 text-sm text-blue-600" : "top-2 text-gray-400 text-base"}
        `}
      >
        {placeholder}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    </div>
  );
};

export default CustomSelect;
