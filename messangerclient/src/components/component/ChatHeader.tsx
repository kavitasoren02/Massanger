import {
  UserRound,
  Images,
  Search,
  BellOff,
  Eraser,
  Trash2,
  X,
  Logs,
  Image,
} from "lucide-react";
import type {
  DeleteMessage,
  Props1,
} from "../../Service/interface";
import { MdCall } from "react-icons/md";
import { IoMdVideocam } from "react-icons/io";
import { HiDotsVertical } from "react-icons/hi";
import { formatLastSeen } from "../../utils/date";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { _delete } from "../../Service/axios";
import { DELETE_MESSAGE } from "../../Service/useApiService";
import { toast } from "react-toastify";

const ChatHeader = ({
  openSidebar,
  currentUser,
  setProfileOpen,
  setUpdateMessage,
}: Props1) => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const menu = [
    {
      icons: UserRound,
      label: "View Contact",
      onClick: () => {
        (setProfileOpen(), setOpenMenu(false));

        // console.log("View Contact");
      },
    },
    {
      icons: Images,
      label: "Media, Links & Documents",
      onClick: () => {
        console.log("Media, Links & Documents");
      },
    },
    {
      icons: Search,
      label: "Search",
      onClick: () => {
        console.log("Search");
      },
    },
    {
      icons: BellOff,
      label: "Mute Notifications",
      onClick: () => {
        console.log("Mute Notifications");
      },
    },
    {
      icons: Image,
      label: "Wallpaper",
      onClick: () => {
        console.log("Wallpapaer");
      },
    },
    {
      icons: Eraser,
      label: "Clear Chat",
      onClick: async () => {
        try {
          const { data } = await _delete<DeleteMessage>(DELETE_MESSAGE, {
            params: {
              recieverId: id,
            },
          });
          toast.success(data.message);
          setOpenMenu(false);
          setUpdateMessage((prev) => prev + 1);
        } catch (error) {
          toast.error("Failed to Delete");
        }
      },
    },
    {
      icons: Trash2,
      label: "Delete Chat",
      onClick: () => {
        console.log("Delete Chat");
      },
    },
    {
      icons: X,
      label: "Close Chat",
      onClick: () => {
        navigate("/chat");
        // console.log("Close Chat");
      },
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <div className="h-[65px] w-full bg-[#329A93] flex items-center justify-between px-4 shadow-md rounded-xl">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-3">
        {/* Hamburger */}
        <button
          onClick={openSidebar}
          className="md:hidden bg-white p-1 rounded-lg"
        >
          <Logs className="w-5 h-5 text-black" />
        </button>

        <div className="flex items-center gap-3">
          {currentUser?.profilePic ? (
            <img
              src={currentUser?.profilePic}
              alt="Profile pic"
              className="h-8 w-8 md:h-10 md:w-10 rounded-full overflow-hidden flex justify-center items-center cursor-pointer"
            />
          ) : (
            <div
              onClick={setProfileOpen}
              className="h-8 w-8 md:h-10 md:w-10 rounded-full overflow-hidden flex justify-center items-center bg-gray-200 text-xl font-semibold cursor-pointer"
            >
              {currentUser?.fullName.charAt(0)}
            </div>
          )}

          <div className="leading-tight">
            <p className="text-white font-semibold text-[12px] md:text-lg">
              {currentUser?.fullName}
            </p>
            <span className="text-white/80 text-[10px] md:text-sm">
              {currentUser?.isOnline
                ? "Online"
                : currentUser?.lastSeen
                  ? formatLastSeen(currentUser?.lastSeen)
                  : ""}
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-5 text-white text-xl">
        <MdCall className="cursor-pointer hover:scale-110 transition duration-150" />
        <IoMdVideocam className="cursor-pointer hover:scale-110 transition duration-150" />
        <HiDotsVertical
          onClick={() => setOpenMenu(true)}
          className="cursor-pointer hover:scale-110 transition duration-150"
        />
      </div>
      {openMenu && (
        <div
          ref={menuRef}
          className="absolute top-[60px] right-[40px] max-h-[500px] w-[250px] bg-white rounded-2xl overflow-hidden shadow-lg"
        >
          {menu.map(({ icons: Icon, label, onClick }) => (
            <button
              onClick={onClick}
              key={label}
              className="w-full py-2 px-4 flex items-start text-left
                   hover:bg-gray-200
                   cursor-pointer
                   transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-gray-700 shrink-0" />

                <span className="text-sm text-gray-800">{label}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
