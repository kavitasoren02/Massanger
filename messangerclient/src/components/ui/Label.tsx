import type { LabelProps } from "../../Service/interface";


const Label = ({ htmlFor, text }: LabelProps) => {
  if (!text) return null;

  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-white mb-1 md:text-base"
    >
      {text}
    </label>
  );
};

export default Label;
