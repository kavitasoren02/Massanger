import { Pencil, X, Phone, Search, Video } from "lucide-react";
import type { ProfileProps } from "../../Service/interface";

const ProfileScreen = ({ setProfileOpen, currentUser }: ProfileProps) => {
  return (
    <div className="w-full max-w-[500px] h-full bg-white rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4" >
        <div className="flex items-center gap-2">
          <button
            onClick={setProfileOpen}
            className="p-2 rounded-full hover:bg-gray-100 cursor-pointer" title="Close"
          >
            <X className="w-6 h-6 sm:w-7 sm:h-7"  />
          </button>

          <h2 className="text-lg sm:text-xl font-semibold">Contact Info</h2>
        </div>

        <button className="p-2 rounded-full hover:bg-gray-100 cursor-pointer" title="Edit">
          <Pencil className="w-5 h-5 sm:w-6 sm:h-6"/>
        </button>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center justify-center px-4 py-8 sm:py-10 border-gray-200">
        {/* Profile Image */}
        {currentUser?.profilePic ? (
          <img
            src={currentUser?.profilePic}
            alt="Profile pic"
            className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover bg-amber-100"
          />
        ) : (
          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover bg-gray-200 flex justify-center items-center font-bold text-3xl">
            {currentUser?.fullName.charAt(0)}
          </div>
        )}

        {/* Name */}
        <h1 className="mt-5 text-2xl sm:text-3xl font-medium text-center">
          {currentUser?.fullName}
        </h1>

        {/* Phone */}
        <p className="mt-2 text-sm sm:text-base md:text-lg text-gray-500 text-center">
          {`${currentUser?.countryCode} ${currentUser?.mobileNumber}`}
        </p>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 sm:gap-6 md:gap-8 mt-8 w-full">
          {[
            { icon: Phone, label: "Voice" },
            { icon: Video, label: "Video" },
            { icon: Search, label: "Search" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center">
              <button className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition cursor-pointer">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-gray-700" />
              </button>

              <span className="mt-2 text-xs sm:text-sm text-black">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
