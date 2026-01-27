import type { SelectProps } from "../../Service/interface";

const Select = ({ options, error, ...props }: SelectProps) => {
  return (
    <div className="relative mb-4 w-full">
      <select
        {...props}
        className="w-full px-4 py-3 bg-[#F1F1F1] text-black rounded-md  text-lg sm:text-md font-bold outline-none"
      >
        <option value="" disabled hidden>
          Select
        </option>

        {options.map((option, index) => (
          <option className="text-[#329A93]" key={index} value={option.code }>
            {/* {option.flag} */}
            {/* {option.name}
            {" "} */}
            {option.code}
          </option>
        ))}
      </select>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Select;
