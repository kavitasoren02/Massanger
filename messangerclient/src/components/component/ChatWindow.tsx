import ChatMessage from "./ChatMessage";
import ChatHeader from "./ChatHeader";
import type { ApiResponse, IMESSAGE, Props1 } from "../../Service/interface";
import ChatInput from "./ChatInput";
import { useEffect, useState } from "react";
import { _get } from "../../Service/axios";
import { GET_ALL_MESSAGE } from "../../Service/useApiService";
import { useAuth } from "../../ProtectedRoute/AuthProvider";
import { useChatContextProvider } from "../../pages/chats/context/ChatContextProvider";

const ChatWindow = ({ openSidebar, id, currentUser }: Props1) => {
  const [messages, setMessages] = useState<IMESSAGE[]>([]);
  const { socket } = useChatContextProvider();

  const { user } = useAuth();

  const sendMessage = (message: IMESSAGE) => {
    console.log(message);
    setMessages((prev) => [...prev, message]);
    if(!socket) return;
    const {createdAt, ...messageObject} = message
    socket.emit("topic/sendMessage", messageObject);
  };

  const getAllMessage = async (senderId: string, receiverId: string) => {
    try {
      const { data } = await _get<ApiResponse<IMESSAGE[]>>(GET_ALL_MESSAGE, {
        params: {
          senderId,
          receiverId,
        },
      });
      console.log({ data });
      setMessages(data.data);
    } catch (error: unknown) {
      // Do Nothing
    }
  };

  useEffect(() => {
    if (!user?._id || !id) return;

    setMessages([]);
    getAllMessage(user._id, id);
  }, [id, user?._id]);

  useEffect(() => {
    if(!socket) return;
    socket.on("topic/receiveMessage", (message: IMESSAGE) => {
      console.log({message});
      
      setMessages((prev) => [...prev, message]);
    })
  },[socket, setMessages])

  return (
    <div className="flex-1 flex flex-col h-full rounded-r-2xl pl-2 gap-2 overflow-hidden">
      {/* Header */}
      {id && <ChatHeader currentUser={currentUser} openSidebar={openSidebar} />}

      {/* Messages */}
      <div className="flex-1 bg-[#D9D9D9] overflow-hidden">
        <ChatMessage messages={messages} id={id} />
      </div>

      {/* Input Wrapper */}
      {id && (
        <div className="rounded-cdxl bg-white">
          <ChatInput sendMessage={sendMessage} />
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
