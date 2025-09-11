import React from "react";
import Select from "react-select";

const CustomSelect = ({ options, value, onChange, placeholder }) => {
  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder || "Select option"}
      isSearchable
      className="w-full"
      classNamePrefix="custom-select"
      styles={{
        control: (base, state) => ({
          ...base,
          borderRadius: "0.5rem",
          borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
          boxShadow: state.isFocused ? "0 0 0 2px #93c5fd" : "none",
          "&:hover": {
            borderColor: "#3b82f6",
          },
          padding: "2px 4px",
        }),
        placeholder: (base) => ({
          ...base,
          color: "#9ca3af", // Tailwind text-gray-400
        }),
        menu: (base) => ({
          ...base,
          borderRadius: "0.5rem",
          marginTop: "4px",
          zIndex: 50,
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused
            ? "#e5e7eb" // Tailwind gray-200
            : "white",
          color: "#111827", // Tailwind gray-900
          "&:active": {
            backgroundColor: "#bfdbfe", // Tailwind blue-200
          },
        }),
      }}
    />
  );
};

export default CustomSelect;
