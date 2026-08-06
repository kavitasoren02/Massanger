import { GrAttachment } from "react-icons/gr";
import { RiBearSmileFill } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import type { ChatInputProps, IMESSAGE } from "../../Service/interface";
import {
  useRef,
  useState,
  useEffect,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { READ_STATUS } from "../../Service/enum/ReadStatus";
import { useParams } from "react-router-dom";
import { useAuth } from "../../ProtectedRoute/AuthProvider";
import { useChatContextProvider } from "../../pages/chats/context/ChatContextProvider";
import EmojiPicker from "./EmojiPicker";
import type { EmojiClickData } from "emoji-picker-react";

const ChatInput = ({ sendMessage }: ChatInputProps) => {
  const { id } = useParams();
  const { user } = useAuth();
  const { socket } = useChatContextProvider();

  const typingRef = useRef<number>(0);

  //for emoji modal close
  const pickerRef = useRef<HTMLDivElement>(null);

  const [isOpenEmojiPicker, setIsOpenEmojiPicker] = useState(false);

  const [message, setMessage] = useState<IMESSAGE>({
    content: "",
    messageType: "text",
    readStatus: READ_STATUS.SINGLE_TICK,
    senderId: user?._id ?? "",
    recieverId: id ?? "",
  });

  //for emoji modal close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpenEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage((prev) => ({
      ...prev,
      content: e.target.value,
    }));

    const now = Date.now();

    if (now - typingRef.current > 2000) {
      if (!socket) return;

      socket.emit("topic/typing", {
        senderId: user?._id ?? "",
        recieverId: id ?? "",
      });

      typingRef.current = now;
    }
  };

  const onEmojiClick = (emoji: EmojiClickData) => {
    setMessage((prev) => ({
      ...prev,
      content: prev.content + emoji.emoji,
    }));

    setIsOpenEmojiPicker(false);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!message.content.trim()) return;

    sendMessage({
      ...message,
      senderId: user?._id ?? "",
      recieverId: id ?? "",
      createdAt: new Date().toISOString(),
    });

    setMessage((prev) => ({
      ...prev,
      content: "",
    }));
  };

  return (
    <form className="relative w-full" onSubmit={handleSubmit}>
      <div className="flex items-center gap-2 sm:gap-3 h-14 px-2 sm:px-4 bg-white">
        {/* Attachment */}
        <button type="button">
          <GrAttachment className="text-xl text-gray-500 hover:text-gray-700" />
        </button>

        {/* Emoji */}
        <div className="relative" ref={pickerRef}>
          <button
            type="button"
            onClick={() => setIsOpenEmojiPicker((prev) => !prev)}
          >
            <RiBearSmileFill className="text-2xl text-gray-500 hover:text-gray-700 cursor-pointer" />
          </button>

          <EmojiPicker isOpen={isOpenEmojiPicker} onEmojiClick={onEmojiClick} />
        </div>

        {/* Input */}
        <div className="flex-1">
          <input
            value={message.content}
            onChange={onChangeHandler}
            type="text"
            placeholder="Type a message..."
            className="w-full bg-transparent outline-none text-sm sm:text-base text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Send */}
        <button
          type="submit"
          disabled={!message.content.trim()}
          className="flex items-center justify-center h-10 w-10 rounded-full bg-[#329A93] hover:scale-105 transition disabled:opacity-60"
        >
          <IoSend className="text-white text-lg" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
