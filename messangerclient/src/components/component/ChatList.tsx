import { Bell, Search, X, ChevronRight, LogOut } from "lucide-react";
import type {
  ApiResponse,
  Props2,
  typingProps,
  User,
} from "../../Service/interface";
import { _get } from "../../Service/axios";
import { GET_ALL_USER } from "../../Service/useApiService";
import { useEffect, useState, type ChangeEvent } from "react";
import ChatUserCards from "./ChatUserCards";
import { useChatContextProvider } from "../../pages/chats/context/ChatContextProvider";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../ProtectedRoute/AuthProvider";

const ChatList = ({ closeSidebar, setCurrentUser }: Props2) => {
  const [userList, setUserList] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  const { socket } = useChatContextProvider();
  const { handleLogout } = useAuth();
  
  const { id } = useParams();
  console.log(id);

  const navigate = useNavigate();

  const getAllUsers = async () => {
    try {
      const { data } = await _get<ApiResponse<User[]>>(GET_ALL_USER, {
        params: {
          searchTerm: search,
        },
      });
      setUserList(data.data);
    } catch (error: any) {}
  };

  console.log({ userList });

  useEffect(() => {
    getAllUsers();
  }, [search]);

  useEffect(() => {
    if (!socket) return;

    // user connected
    socket.on("topic/userConnected", (data) => {
      const { userId } = data;
      setUserList((prev) => {
        return prev.map((user) => {
          if (user._id == userId) {
            return { ...user, isOnline: true };
          }
          return user;
        });
      });
    });

    // typing
    socket.on("topic/isTyping", (data: typingProps) => {
      console.log({ data });

      setUserList((prev) => {
        return prev.map((user) => {
          return {
            ...user,
            isTyping: user._id === data.senderId ? data.isTyping : false,
          };
        });
      });
      setCurrentUser((prev) => {
        if (!prev) return;
        return {
          ...prev,
          isTyping: prev._id === data.senderId ? data.isTyping : false,
        };
      });
    });

    // user disconnected
    socket.on("topic/userDisconnected", (data) => {
      const { userId } = data;
      setUserList((prev) => {
        return prev.map((user) => {
          if (user._id == userId) {
            return { ...user, isOnline: false };
          }
          return user;
        });
      });
    });
  }, [socket, setUserList]);

return (
  <div className="flex flex-col h-screen md:h-full md:p-4">
    {/* Header */}
    <div className="flex items-center justify-between">
      <h1 className="text-xl md:text-2xl font-semibold">
        Massenger
      </h1>

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
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSearch(e.target.value)
        }
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

    {/* Users List */}
    <div className="flex-1 overflow-y-auto mt-4">
      {userList.length <= 0 ? (
        <p className="text-gray-400 text-center mt-10">
          No conversations yet
        </p>
      ) : (
        <div>
          {userList.map((user) => (
            <div
              key={user._id}
              onClick={() => {
                navigate(`/chat/${user._id}`);
                closeSidebar();
              }}
            >
              <ChatUserCards
                _id={user._id}
                fullName={user.fullName}
                profilePic={user.profilePic}
                isOnline={user.isOnline}
                isSelected={user._id === id}
                isTyping={user.isTyping}
              />
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Bottom Profile Section */}
    <div className="mt-auto border-t border-gray-200 pt-4 relative">
      <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 cursor-pointer">
        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-700">
            KS
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">
              Kavita Soren
            </h3>
            <p className="text-sm text-gray-500">
              View Profile
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowLogoutModal(!showLogoutModal);
          }}
        >
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="absolute bottom-20 left-0 right-0 mx-3 bg-white border border-gray-200 rounded-xl shadow-lg p-2 z-50">
          <button
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition"
            onClick={handleLogout}
          >
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-600" />
            </div>

            <div className="text-left">
              <h3 className="font-semibold text-red-600">
                Logout
              </h3>
              <p className="text-sm text-gray-500">
                Sign out from account
              </p>
            </div>
          </button>
        </div>
      )}
    </div>
  </div>
);
};

export default ChatList;
