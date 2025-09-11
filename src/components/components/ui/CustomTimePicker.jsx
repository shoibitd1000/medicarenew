import React, { useState } from "react";
import { Clock } from "lucide-react";

const CustomTimePicker = ({ 
  value, 
  handleTime, 
  placeHolderText = "Select Time", 
  repClass = "", 
  icon 
}) => {
  const [time, setTime] = useState(value || "");

  const onChange = (e) => {
    setTime(e.target.value);
    handleTime(e.target.value);
  };

  return (
    <div className="relative w-full">
      <input
        type="time"
        value={time}
        onChange={onChange}
        placeholder={placeHolderText}
        className={`border rounded-md px-3 py-2 w-full text-sm ${repClass}`}
      />
      {icon && <span>{icon}</span>}
    </div>
  );
};

export default CustomTimePicker;
