import { Logs } from "lucide-react";
import type { Props1 } from "../../Service/interface";
import { MdCall } from "react-icons/md";
import { IoMdVideocam } from "react-icons/io";
import { HiDotsVertical } from "react-icons/hi";
import { formatLastSeen } from "../../utils/date";

const ChatHeader = ({ openSidebar, currentUser, setProfileOpen }: Props1) => {
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
        <HiDotsVertical className="cursor-pointer hover:scale-110 transition duration-150" />
      </div>
    </div>
  );
};

export default ChatHeader;
