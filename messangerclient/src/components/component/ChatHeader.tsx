import { Logs } from "lucide-react";
import type { Props1 } from "../../Service/interface";
import { MdCall } from "react-icons/md";
import { IoMdVideocam } from "react-icons/io";
import { HiDotsVertical } from "react-icons/hi";

const ChatHeader = ({ openSidebar, currentUser }: Props1) => {
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

          <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-black overflow-hidden">
         
          </div>

          <div className="leading-tight">
            <p className="text-white font-semibold text-[12px] md:text-lg">
              {currentUser?.fullName}
            </p>
            <span className="text-white/80 text-[10px] md:text-sm">
              {currentUser?.isOnline ? "Online" : "Offline"}
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