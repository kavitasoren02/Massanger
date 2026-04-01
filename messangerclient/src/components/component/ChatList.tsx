import { Bell, Search, X } from "lucide-react";
import type { ApiResponse, Props2, User } from "../../Service/interface";
import { _get } from "../../Service/axios";
import { GET_ALL_USER } from "../../Service/useApiService";
import { useEffect, useState } from "react";
import ChatUserCards from "./ChatUserCards";
import { useChatContextProvider } from "../../pages/chats/context/ChatContextProvider";

const ChatList = ({ closeSidebar }: Props2) => {
  const [userList, setUserList] = useState<User[]>([]);

  const { socket } = useChatContextProvider();

  const getAllUsers = async () => {
    try {
      const { data } = await _get<ApiResponse<User[]>>(GET_ALL_USER);
      setUserList(data.data);
    } catch (error: any) {}
  };

  console.log({ userList });

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("topic/userConnected", (data) => {
      const { userId } = data;
      setUserList((prev) => {
        return prev.map((user) =>{
          if(user._id == userId){
            return {...user, isOnline: true }
          }
          return user;
        })
      })
    });

    socket.on("topic/userDisconnected", (data) =>{
      const { userId } = data;
      setUserList((prev) => {
        return prev.map((user) => {
          if(user._id == userId){
            return {...user, isOnline: false}
          }
          return user;
        })
      })
    })
  }, [socket, setUserList]);

  return (
    <div className="flex flex-col h-full md:p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold">Massenger</h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-5 h-5 md:w-6 md:h-6 text-gray-600 cursor-pointer" />
            <span className="absolute w-2 h-2 rounded-full bg-red-600 top-0 right-0"></span>
          </div>

          {/* Close icon (mobile only) */}
          <button onClick={closeSidebar} className="md:hidden">
            <X className="w-7 h-7 text-gray-800" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mt-6">
        <Search className="w-4 h-4 md:w-5 md:h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />

        <input
          type="text"
          placeholder="Search chats"
          className="
            w-full 
            text-sm md:text-base lg:text-lg
            pl-9 pr-3 py-3
            bg-[#EDEDED] 
            rounded-lg 
            outline-none 
            focus:ring-2 focus:ring-teal-400
          "
        />
      </div>

      {/* Users */}
      <div className="flex-1 overflow-y-auto mt-4">
        {userList.length <= 0 ? (
          <p className="text-gray-400 text-center mt-10">
            No conversations yet
          </p>
        ) : (
          <div className="">
            {userList.map((user) => (
              <ChatUserCards
                _id={user._id}
                fullName={user.fullName}
                profilePic={user.profilePic}
                isOnline={user.isOnline}
                key={user._id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
