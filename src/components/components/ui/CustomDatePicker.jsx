import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker = ({ repClass, value, placeHolderText, handleDate, icon }) => {
  return (
    <div className="relative w-full">
      <DatePicker
        selected={value}
        onChange={(date) => handleDate(date)}
        className={`w-full border px-3 py-2 rounded-md ${repClass}`}
        placeholderText={placeHolderText}
        dateFormat="dd/MM/yyyy"
        wrapperClassName="w-full"
      />
      {icon ? icon : ""}
    </div>
  );
};

export default CustomDatePicker;
