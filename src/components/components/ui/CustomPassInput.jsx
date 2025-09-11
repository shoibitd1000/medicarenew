import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const CustomPasswordInput = ({ value, onChange, placeholder, leftIcon, repClass, required }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative w-full">
            {leftIcon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">
                    {leftIcon}
                </div>
            )}

            <input
                type={showPassword ? "text" : "password"}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
          ${leftIcon ? "pl-10" : "pl-3"} pr-10 py-2 font-medium ${repClass}`}
                required
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
        </div>
    );
};

export default CustomPasswordInput;
