import React, { useState, useRef } from "react";
import Select from "react-select";

const CustomSelect = ({
  options = [],       // raw API data
  value,              // controlled value
  onChange,           // change handler
  placeholder = "--Select--", // default placeholder
  defaultValue,       // default selected value
  id,
  required,
  valueKey = "ID",    // API key for value
  labelKey = "doctorname", // API key for label
}) => {
  const selectRef = useRef(null);

  // Map raw API data → react-select options
  const formattedOptions = options.map((item) => ({
    value: item[valueKey],
    label: item[labelKey],
    ...item,
  }));

  // Determine selected option
  const selectedOption = formattedOptions.find(
    (option) =>
      option.value ===
      (value?.value !== undefined ? value.value : value || defaultValue)
  );

  return (
    <div className="relative w-full">
      <Select
        ref={selectRef}
        id={id}
        options={formattedOptions}
        value={selectedOption || null}   // controlled value
        onChange={onChange}
        placeholder={placeholder}        // normal placeholder
        defaultValue={formattedOptions.find(opt => opt.value === defaultValue) || null} // initial default
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
          menu: (base) => ({ ...base, borderRadius: "0.5rem", marginTop: "4px", zIndex: 50 }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? "#e5e7eb" : "white",
            color: "#111827",
            "&:active": { backgroundColor: "#bfdbfe" },
          }),
        }}
      />

      {required && !selectedOption && (
        <span className="text-red-500 text-sm absolute right-0 top-2">*</span>
      )}
    </div>
  );
};

export default CustomSelect;
