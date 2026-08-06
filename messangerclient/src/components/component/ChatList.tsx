import { Bell, Search, X, ChevronRight, LogOut } from "lucide-react";
import type {
  ApiResponse,
  IMESSAGE,
  Props2,
  typingProps,
  // User,
  UserDetails,
} from "../../Service/interface";
import { _get } from "../../Service/axios";
import { GET_ALL_USER } from "../../Service/useApiService";
import { useEffect, useState, useRef, type ChangeEvent } from "react";
import ChatUserCards from "./ChatUserCards";
import { useChatContextProvider } from "../../pages/chats/context/ChatContextProvider";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../ProtectedRoute/AuthProvider";

const ChatList = ({ closeSidebar, setCurrentUser }: Props2) => {
  const [userList, setUserList] = useState<UserDetails[]>([]);
  const [search, setSearch] = useState<string>("");
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const { socket } = useChatContextProvider();
  const { handleLogout, user } = useAuth();

  const { id } = useParams();
  // console.log(id);

  const navigate = useNavigate();

  const getAllUsers = async () => {
    try {
      const { data } = await _get<ApiResponse<UserDetails[]>>(GET_ALL_USER, {
        params: {
          searchTerm: search,
        },
      });
      setUserList(data.data);
    } catch (error: any) {}
  };

  // console.log({ userList });

  // click outside modal will close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowLogoutModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

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
      // console.log({ data });

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
  }, [socket, setUserList, id]);

  // to show  last message
  const handleLastMessage = (msg: IMESSAGE) => {
    setUserList((prev) => {
      return prev.map((user) => {
        if (user._id === msg.senderId) {
          return {
            ...user,
            lastMessage: msg,
            count: msg.senderId === id ? 0 : (user.count || 0) + 1,
          };
        } else {
          return user;
        }
      });
    });
  };

  const updateLastMessage = (msg: IMESSAGE) => {
    setUserList((prev) => {
      // console.log({ msg, prev });
      return prev.map((user) => {
        if (msg.recieverId === user._id) {
          return {
            ...user,
            lastMessage: msg,
          };
        } else {
          return user;
        }
      });
    });
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("topic/receiveMessage", handleLastMessage);

    socket.on("topic/updateMessage", updateLastMessage);

    return () => {
      socket.off("topic/receiveMessage", handleLastMessage);

      socket.off("topic/updateMessage", updateLastMessage);
    };
  }, [socket, setUserList,id]);

  //  to update count

  useEffect(() => {
    if (!id) return;
    setUserList((prev) => {
      return prev.map((user) => {
        if (user._id === id) {
          return {
            ...user,
            count: 0,
          };
        } else {
          return user;
        }
      });
    });
  }, [id]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold">Massenger</h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-5 h-5 md:w-6 md:h-6 text-gray-600 cursor-pointer" />
            <span className="absolute w-2 h-2 rounded-full bg-red-600 top-0 right-0"></span>
          </div>

          {/* Close icon (mobile only) */}
          <button onClick={closeSidebar} className="md:hidden" title="Close">
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
      <div className="flex-1 overflow-y-auto mt-4 pr-1">
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
                  lastMessage={user.lastMessage}
                  count={user.count}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Profile Section */}
      <div className="mt-auto border-t border-gray-200 pt-4 relative">
        <div
          className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-100"
          onClick={(e) => {
            e.stopPropagation();
            setShowLogoutModal(!showLogoutModal);
          }}
        >
          {/* Left Section */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="
          w-10 h-10
          sm:w-11 sm:h-11
          md:w-12 md:h-12
          rounded-full bg-gray-200
          flex items-center justify-center
          font-semibold text-gray-700
          shrink-0
        "
            >
              {user?.fullName
                .split(" ")
                ?.map((name) => name[0])
                .join("")
                .toUpperCase()}
            </div>

            <div className="min-w-0">
              <h3 className="font-semibold text-sm sm:text-base truncate">
                {user?.fullName}
              </h3>

              <p className="text-xs sm:text-sm text-gray-500 truncate">
                View Profile
              </p>
            </div>
          </div>

          {/* Arrow */}
          <button
            className="p-2 rounded-lg hover:bg-gray-200 shrink-0"
            // onClick={(e) => {
            //   e.stopPropagation();
            //   setShowLogoutModal(!showLogoutModal);
            // }}
          >
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Logout Modal */}
        {showLogoutModal && (
          <div
            ref={modalRef}
            className="
        absolute
        bottom-20
        left-0
        right-0
        mx-2
        bg-white
        border border-gray-200
        rounded-xl
        shadow-lg
        p-2
        z-50
      "
          >
            <button
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50"
              onClick={handleLogout}
            >
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-600" />
              </div>

              <div className="text-left">
                <h3 className="font-semibold text-red-600">Logout</h3>

                <p className="text-sm text-gray-500">Sign out from account</p>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
