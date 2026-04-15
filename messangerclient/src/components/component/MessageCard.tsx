import React from "react";
import type { MessageCardProps } from "../../Service/interface";
import { IoCheckmark, IoCheckmarkDone } from "react-icons/io5";
import { MdOutlineWatchLater } from "react-icons/md";

const MessageCard = ({
  isSended,
  content,
  status,
  user,
  createdAt,
}: MessageCardProps) => {
  return (
    <div className={`w-full flex my-1 ${isSended ? "justify-end" : "justify-start"}`}>
      
      <div
        className={`
          flex items-end gap-2 
          max-w-full xl:max-w-[60%]
          ${isSended ? "flex-row" : "flex-row-reverse"}
        `}
      >
        
        {/* Message */}
        <div className="flex flex-col">
          <div
            className={`
              px-3 py-2 sm:px-4 sm:py-3 rounded-xl shadow-sm break-words
              text-sm sm:text-base
              ${isSended ? "bg-[#329A93] text-white" : "bg-gray-200 text-black"}
            `}
          >
            {content}
          </div>

          {/* Time */}
          <span className={`text-[10px] sm:text-xs text-gray-500 mt-1 px-1 flex ${!isSended ? 'justify-end' : 'justify-start'}`}>
            {new Date(createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* Status + Profile pic */}
        <div className="flex flex-col items-center justify-end gap-1">
          
          {/* Status*/}
          <span className="text-xs sm:text-sm text-gray-500">
            {isSended && 
            <IoCheckmark/>}
          </span>

          {/* Profile pic*/}
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-400 overflow-hidden flex items-center justify-center">
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[10px] sm:text-xs text-white font-semibold">
                {user?.fullName?.charAt(0)}
              </span>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default MessageCard;