import React from "react";

interface Props {
  _id: string;
  fullName: string;
  profilePic?: string;
  isOnline: boolean;
  isSelected: boolean;
}

const ChatUserCards = ({ _id, fullName, profilePic, isOnline, isSelected }: Props) => {
  return (
    <div className={`flex items-center gap-3 p-2 sm:p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition ${isSelected && 'bg-gray-300'}`}>
      {/* Profile Image */}
      <div className="relative">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {profilePic ? (
            <img
              src={profilePic}
              alt={fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <p className="font-semibold text-lg sm:text-xl text-gray-700">
              {fullName.charAt(0).toUpperCase()}
            </p>
          )}
        </div>

        {/* Online Indicator */}
        {isOnline && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
        )}
      </div>

      {/* User Info */}
      <div className="flex flex-col flex-1 min-w-0">
        <h2 className="text-sm sm:text-base font-medium text-gray-900 truncate">
          {fullName}
        </h2>

        <p className="text-xs sm:text-sm text-gray-500 truncate">
          {isOnline ? "Online" : "Offline"}
        </p>
      </div>
    </div>
  );
};

export default ChatUserCards;
