import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

const CustomMultiSelect = ({
  options,
  selectedValues,
  repClass,
  onChange,
  placeholderText,
  placeholder = "Select options...",
  label,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [search, setSearch] = useState("");

  const hasValue = selectedValues && selectedValues.length > 0;
  const wrapperRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setIsFocused(!isOpen);
  };

  // Handle add/remove selection
  const handleSelect = (option) => {
    const exists = selectedValues.some((item) => item.value === option.value);
    if (exists) {
      onChange(selectedValues.filter((item) => item.value !== option.value));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  // Remove individual item
  const removeItem = (value) => {
    onChange(selectedValues.filter((item) => item.value !== value));
  };

  const filteredOptions = options.filter((opt) =>
    opt.label?.toLowerCase().includes(search.toLowerCase())
  );

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* Floating Label */}
      {label && (
        <label
          className={`absolute left-3 px-1 bg-white transition-all duration-200 
          ${hasValue || isFocused ? "-top-3 text-sm text-blue-600" : "top-2 text-gray-400 text-base"}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input / Selected Items */}
      <div
        className={`peer border rounded-md px-3 py-2 w-full text-sm flex flex-wrap gap-1 bg-white cursor-pointer ${repClass}`}
        onClick={toggleDropdown}
        tabIndex={0} // so onBlur works properly
      >
        {selectedValues.length > 0 ? (
          selectedValues.map((item) => (
            <span
              key={item.value}
              className="flex items-center gap-1 bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded"
            >
              {item.label}{" "}
              <span className="text-gray-500 text-xs">₹{item.rate}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(item.value);
                }}
                className="ml-1 text-red-500 hover:text-red-700"
              >
                <X size={14} />
              </button>
            </span>
          ))
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute mt-1 w-full bg-white border rounded shadow-lg z-10 max-h-60 overflow-y-auto">
          {/* Search */}
          <div className="p-2">
            <input
              type="text"
              className="w-full border p-1 rounded text-sm"
              placeholder={placeholderText}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>

          {/* Options */}
          <ul className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = selectedValues.some(
                  (item) => item.value === opt.value
                );
                return (
                  <li
                    key={opt.value}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelect(opt)}
                  >
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={isSelected} readOnly />
                      <span>{opt.label}</span>
                    </div>
                    <span className="text-gray-500 text-xs">₹{opt.rate}</span>
                  </li>
                );
              })
            ) : (
              <li className="p-2 text-gray-400 text-sm">No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomMultiSelect;
