import { useEffect, useState } from "react";
import ChatList from "../../components/component/ChatList";
import ChatWindow from "../../components/component/ChatWindow";
import type { ApiResponse, User } from "../../Service/interface";
import { useParams } from "react-router-dom";
import { GET_USER_BYID } from "../../Service/useApiService";
import { _get } from "../../Service/axios";
import { useChatContextProvider } from "./context/ChatContextProvider";
import ProfileScreen from "../../components/component/ProfileScreen";

const Chat = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [currentUser, setcurrentUser] = useState<User>();
  const [profileOpen, setProfileOpen] = useState<boolean>(false);

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
      if (currentUser?._id == userId) {
        setcurrentUser((prev) => {
          if (!prev) return;
          return { ...prev, isOnline: false, lastSeen: data.lastSeenDate };
        });
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
    h-full
    bg-white
    rounded-r-3xl md:rounded-3xl
    p-4 sm:p-5

    fixed md:static top-0 left-0 z-50

    w-[85%]
    sm:w-[70%]
    md:w-[40%]
    lg:w-[32%]
    xl:w-[26%]

    transform transition-transform duration-300 ease-in-out

    ${open ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
  `}
      >
        <ChatList
          closeSidebar={() => setOpen(false)}
          currentUser={currentUser!}
          setCurrentUser={setcurrentUser}
        />
      </div>
      <ChatWindow
        setProfileOpen={() => {
          setProfileOpen(true);
        }}
        currentUser={currentUser}
        id={id}
        openSidebar={() => setOpen(true)}
      />
      <div
        className={`absolute top-4 right-0 bottom-4 w-full max-w-[500px]
    transition-transform duration-300 ease-in-out p-2
    ${profileOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-full shadow-lg overflow-hidden rounded-l-2xl">
          <ProfileScreen
            currentUser={currentUser}
            setProfileOpen={() => setProfileOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
