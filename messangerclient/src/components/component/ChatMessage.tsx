import { useEffect, useRef } from "react";
import { useAuth } from "../../ProtectedRoute/AuthProvider";
import type { ChatMessageProps } from "../../Service/interface";
import MessageCard from "./MessageCard";

const ChatMessage = ({ id , messages}: ChatMessageProps) => {
  const { user } = useAuth();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [id, messages.length]);
// console.log(messages);

  return (
    <div className="h-full flex flex-col bg-[#D9D9D9] px-4 py-2 overflow-y-auto min-h-0">
      {id ? (
        <div className="flex flex-col gap-2 justify-end">
          {messages.map((message) => (
            <MessageCard
              content={message.content}
              createdAt={message.createdAt ?? ""}
              status={message.readStatus}
              isSended={message.senderId === user?._id}
              user={user!}
              id={message._id }
            />
          ))}
          <div ref={bottomRef} />
        </div>
      ) : (
        <div className="h-full w-full flex justify-center items-center">
          <p className="text-gray-400 text-lg text-center">
            Select a conversation
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
