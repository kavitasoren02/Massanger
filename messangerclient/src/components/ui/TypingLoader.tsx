import React from "react";

const TypingLoader: React.FC = () => {
  return (
    <div className="flex items-center gap-1 py-1">
      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.3s]"></span>

      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.15s]"></span>

      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500"></span>
    </div>
  );
};

export default TypingLoader;
