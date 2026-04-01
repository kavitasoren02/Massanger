import { useState } from "react";
import ChatList from "../../components/component/ChatList";
import ChatWindow from "../../components/component/ChatWindow";

const Chat = () => {
  const [open, setOpen] = useState<boolean>(false);

  // useEffect(() => {
  //   socket.on("connect", () => {
  //     console.log("Connected:", socket.id);
  //   });
  // },[]);
  
  return (
    <div className="h-screen flex relative overflow-hidden p-6 bg-[#EDEDED]">
  
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
           min-h-full bg-white rounded-r-2xl md:rounded-none p-2
        fixed md:static top-0 left-0 z-50
        w-[80%] sm:w-[60%] md:w-1/2 lg:w-1/3 xl:w-1/4
        transform transition-transform duration-300 ease-in-out
      
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
      >
        <ChatList closeSidebar={() => setOpen(false)} />
      </div>

<ChatWindow openSidebar={() => setOpen(true)} />
    </div>
  );
};

export default Chat;
