import type { InputHTMLAttributes } from "react";
import Input from "../ui/Input";

interface InputWithLabelProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}
const InputWithLabel = ({label, error, ...props}: InputWithLabelProps) =>{
    return (
         <div className="w-full max-w-md">
      <Input
        label={label}
        error={error}
        {...props}
      />
      </div>
    );
};

export default InputWithLabel;