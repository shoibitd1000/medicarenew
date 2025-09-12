import React from "react";
import { format } from "date-fns";

const CustomDateTimeInput = ({ label, value, onChange, ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block mb-1 text-sm font-medium">{label}</label>}
      <input
        type="datetime-local"
        className="border rounded p-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
        value={value ? format(value, "yyyy-MM-dd'T'HH:mm") : ""}
        onChange={(e) => onChange(new Date(e.target.value))}
        {...props}
      />
    </div>
  );
};

export default CustomDateTimeInput;
