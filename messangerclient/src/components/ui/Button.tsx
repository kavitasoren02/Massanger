import type { ButtonProps } from "../../Service/interface";

const Button = ({
  type = "submit",
  loading = false,
  loadingText = "Processing...",
  disabled = false,
  children,
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`w-full  max-w-md mt-10px
        px-4 py-3
        text-white bg-[#329A93] text-lg sm:text-base
          border border-[#ACACB1]
        rounded-md
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-black
        ${
          disabled || loading
            ? "opacity-60 cursor-not-allowed"
            : "cursor-pointer hover:scale-[1.02]"
        }`}
    >
      {loading ? loadingText:  children}
    </button>
  );
};

export default Button;
