import React, { useState } from "react";

const CustomTextArea = ({
    value,
    handleChange,
    placeholder = "Enter text...",
    rows = 4,
    repClass = "",
    icon,
    placeHolderText,
}) => {
    const [text, setText] = useState(value || "");

    const onChange = (e) => {
        setText(e.target.value);
        if (handleChange) handleChange(e.target.value);
    };

    return (
        <div className="relative w-full">
            <textarea
                value={text}
                onChange={onChange}
                placeholder={placeHolderText ? placeHolderText : placeholder}
                rows={rows}
                className={`border rounded-md px-3 py-2 w-full text-sm resize-none focus:outline-none focus:ring focus:ring-blue-500 ${repClass}`}
            />
            {icon && <span>{icon}</span>}
        </div>
    );
};

export default CustomTextArea;
