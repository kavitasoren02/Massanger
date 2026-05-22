import ChatMessage from "./ChatMessage";
import ChatHeader from "./ChatHeader";
import type {
  ApiResponse,
  BlueTickProps,
  doubleTickProps,
  IMESSAGE,
  Props1,
} from "../../Service/interface";
import ChatInput from "./ChatInput";
import { useEffect, useState } from "react";
import { _get } from "../../Service/axios";
import { GET_ALL_MESSAGE } from "../../Service/useApiService";
import { useAuth } from "../../ProtectedRoute/AuthProvider";
import { useChatContextProvider } from "../../pages/chats/context/ChatContextProvider";
import { Logs } from "lucide-react";
import { READ_STATUS } from "../../Service/enum/ReadStatus";

const ChatWindow = ({ openSidebar, id, currentUser }: Props1) => {
  const [messages, setMessages] = useState<IMESSAGE[]>([]);
  const { socket } = useChatContextProvider();

  const { user } = useAuth();

  const sendMessage = (message: IMESSAGE) => {
    // console.log(message);
    setMessages((prev) => [...prev, message]);
    if (!socket) return;
    const { createdAt, ...messageObject } = message;
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
    if (!socket) return;
    socket.on("topic/receiveMessage", (message: IMESSAGE) => {
      // console.log({ message });

      setMessages((prev) => [...prev, message]);
    });

    socket.on("topic/updateMessage", (recievedmessage: IMESSAGE) => {
      // console.log({rcv:recievedmessage});
      setMessages((prev) => {
        const restMessage = prev.slice(0, prev.length - 1);
        return [...restMessage, recievedmessage];
      });
    });

    socket.on(
      "topic/updateBluetickMessage",
      (bluetickmessage: BlueTickProps) => {
        setMessages((prev) => {
          const newmessage = prev.map((msg) => {
            if (bluetickmessage.ids.includes(msg._id ?? "")) {
              return { ...msg, readStatus: READ_STATUS.BLUE_DOUBLE_TICK };
            } else {
              return msg;
            }
          });
          return newmessage;
        });
      },
    );

    socket.on(
      "topic/updatedoubletickmessage",
      (doubletickmessage: doubleTickProps) => {
        console.log(doubletickmessage);
        
        setMessages((prev) => {
          return prev.map((msg) => {
            return {
              ...msg, readStatus: doubletickmessage.messageIds.includes(msg._id ?? "") ? READ_STATUS.DOUBLE_TICK : msg.readStatus
            }
          })
        })
      }
    )
  }, [socket, setMessages]);


  useEffect(() => {
    if (messages.length === 0 || !socket) return;

    const ids = messages
      .filter((msg) => msg.senderId === id && (msg.readStatus === READ_STATUS.DOUBLE_TICK || msg.readStatus === READ_STATUS.SINGLE_TICK))
      .map((msg) => msg._id);
    console.log(ids);

    const updateStatus = {
      recieverId: id,
      ids: ids,
    };

    if(ids.length <= 0) return;
    socket.emit("topic/bluetickMessage", updateStatus);
  }, [socket, messages]);


  return (
    <div className="flex-1 flex flex-col h-full lg:rounded-r-2xl rounded-2xl gap-2 overflow-hidden relative">
      {/* Header */}
      {id && <ChatHeader currentUser={currentUser} openSidebar={openSidebar} />}
      {!id && (
        <div className="absolute top-2 left-2">
          {/* Hamburger */}
          <button
            onClick={openSidebar}
            className="md:hidden bg-white p-1 rounded-lg"
          >
            <Logs className="w-5 h-5 text-black" />
          </button>{" "}
        </div>
      )}

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
