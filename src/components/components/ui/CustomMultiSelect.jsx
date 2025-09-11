import React, { useState } from "react";
import { X } from "lucide-react"; // cross icon (you can replace with any)

const CustomMultiSelect = ({
    options,
    selectedValues,
    repClass,
    onChange,
    placeholderText,
    placeholder = "Select options...",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");

    const toggleDropdown = () => setIsOpen(!isOpen);

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
        opt.label.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="relative w-full">
            {/* Input / Selected Items */}
            <div
                className={`border rounded-md px-3 py-2 w-full text-sm flex flex-wrap gap-1 bg-white cursor-pointer ${repClass}`}
                onClick={toggleDropdown}
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
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                readOnly
                                            />
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
