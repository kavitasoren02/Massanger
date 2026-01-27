import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Label from "./Label";
import type { InputProps } from "../../Service/interface";


const Input = ({ label, type, error, ...props }: InputProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const inputType = showPassword && type === "password" ? "text" : type;

  return (
    <div className="relative mb-4 w-full max-w-md">
      {label && <Label htmlFor={props.id || props.name} text={label} />}

      <div className="relative">
        <input
          {...props}
          type={inputType}
          className="w-full px-4 py-2 bg-[#EDEDED] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-[#329A93] text-lg sm:text-md font-bold"
        />
        {type === "password" && (
          <div
            onClick={handleTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            {showPassword ? (
              <FaEyeSlash className="text-white text-base sm:text-lg" />
            ) : (
              <FaEye className="text-white text-base sm:text-lg" />
            )}
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
