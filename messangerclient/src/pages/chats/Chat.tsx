import { useEffect, useState } from "react";
import ChatList from "../../components/component/ChatList";
import ChatWindow from "../../components/component/ChatWindow";
import type { ApiResponse, User } from "../../Service/interface";
import { useParams } from "react-router-dom";
import { GET_USER_BYID } from "../../Service/useApiService";
import { _get } from "../../Service/axios";
import { useChatContextProvider } from "./context/ChatContextProvider";

const Chat = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [currentUser, setcurrentUser] = useState<User>();

  const { id } = useParams();

  const { socket } = useChatContextProvider();
  const getUserById = async (id: string | undefined) => {
    if (!id) return;
    try {
      const { data } = await _get<ApiResponse<User>>(`${GET_USER_BYID}/${id}`);
      console.log(data);
      setcurrentUser(data.data);
    } catch (error: any) {}
  };
  useEffect(() => {
    getUserById(id);
  }, [id]);

  useEffect(() => {
    if (!socket) return;
    socket.on("topic/userConnected", (data) => {
      const { userId } = data;
      if (currentUser?._id == userId) {
        setcurrentUser((prev) => {
          if (!prev) return;
          return { ...prev, isOnline: true };
        });
      }
    });

 

    socket.on("topic/userDisconnected", (data) => {
      const { userId } = data;
      if(currentUser?._id == userId){
        setcurrentUser((prev) =>{
          if(!prev) return;
          return{ ...prev, isOnline: false, lastSeen: data.lastSeenDate};
        })
      }
    });
  }, [socket, currentUser, setcurrentUser]);

  return (
    <div className="h-dvh flex relative overflow-hidden p-6 bg-[#EDEDED] gap-2">
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
        <ChatList closeSidebar={() => setOpen(false)}
        currentUser={currentUser!}
        setCurrentUser={setcurrentUser} />
      </div>

      <ChatWindow
        currentUser={currentUser}
        id={id}
        openSidebar={() => setOpen(true)}
      />
    </div>
  );
};

export default Chat;
