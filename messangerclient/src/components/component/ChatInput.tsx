import { GrAttachment } from "react-icons/gr";
import { RiBearSmileFill } from "react-icons/ri";
import { IoSend } from "react-icons/io5";

const ChatInput = () => {
  return (
    <div className="h-[55px] px-4 flex items-center ">


        <div className="flex items-center">
          <GrAttachment className="text-gray-500 text-xl cursor-pointer hover:text-gray-700 transition" />
        </div>

        {/* Input */}
        <div className="flex-1 px-4">
          <input
            type="text"
            className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
            placeholder="Type a message..."
          />
        </div>

        <div className="flex items-center gap-4">

          <RiBearSmileFill className="text-gray-500 text-2xl cursor-pointer hover:text-gray-700 transition" />

          <div className="flex items-center justify-center h-10 w-10 bg-[#329A93] rounded-full cursor-pointer hover:scale-105 transition">
            <IoSend className="text-white text-lg" />
          </div>

        </div>

      </div>

  );
};

export default ChatInput;