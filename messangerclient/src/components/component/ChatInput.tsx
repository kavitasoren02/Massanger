import { GrAttachment } from "react-icons/gr";
import { RiBearSmileFill } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import type { ChatInputProps, IMESSAGE } from "../../Service/interface";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { READ_STATUS } from "../../Service/enum/ReadStatus";
import { useParams } from "react-router-dom";
import { useAuth } from "../../ProtectedRoute/AuthProvider";

const ChatInput = ({ sendMessage }: ChatInputProps) => {
  const { id } = useParams();
  const { user } = useAuth();

  const [message, setMessage] = useState<IMESSAGE>({
    content: "",
    messageType: "text",
    readStatus: READ_STATUS.SINGLE_TICK,
    senderId: user?._id ?? "",
    receiverId: id ?? "",
  });

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage((prev) => {
      return {
        ...prev,
        content: e.target.value,
      };
    });
  };

  return (
    <form
      onSubmit={(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendMessage({
          ...message,
          createdAt: new Date().toLocaleString()
        });
        setMessage((prev) => {
          return {
            ...prev,
            content: "",
          };
        });
      }}
    >
      <div className="h-[55px] px-4 flex items-center ">
        <div className="flex items-center">
          <GrAttachment className="text-gray-500 text-xl cursor-pointer hover:text-gray-700 transition" />
        </div>

        {/* Input */}
        <div className="flex-1 px-4">
          <input
            onChange={onChangeHandler}
            type="text"
            className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
            placeholder="Type a message..."
            value={message.content}
          />
        </div>

        <div className="flex items-center gap-4">
          <RiBearSmileFill className="text-gray-500 text-2xl cursor-pointer hover:text-gray-700 transition" />

          <button
            type="submit"
            disabled={message.content === ""}
            className="flex items-center justify-center h-10 w-10 bg-[#329A93] rounded-full cursor-pointer hover:scale-105 transition disabled:cursor-not-allowed disabled:opacity-70"
          >
            <IoSend className="text-white text-lg" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
