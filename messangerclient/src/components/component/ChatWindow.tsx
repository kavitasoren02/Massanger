import ChatMessage from "./ChatMessage";
import ChatHeader from "./ChatHeader";
import type { Props1 } from "../../Service/interface";
import ChatInput from "./ChatInput";

const ChatWindow = ({ openSidebar, id, currentUser  }: Props1) => {

  return (
    <div className="flex-1 flex flex-col rounded-r-2xl pl-2 gap-2">

      {/* Header */}
      {id && <ChatHeader 
      currentUser={currentUser}
      openSidebar={openSidebar} />}

      {/* Messages */}
      <div className="flex-1 bg-[#D9D9D9] flex flex-col justify-end">
        <ChatMessage />
      </div>

      {/* Input Wrapper */}
      {
        id && <div className="rounded-cdxl bg-white">
        <ChatInput />
      </div>
      }

    </div>
  );
};

export default ChatWindow;