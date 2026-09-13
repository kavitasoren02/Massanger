import { getAllCountries } from "country-code-data";
import Profilescreen from "../../assets/profilescreen.svg";
import { ArrowLeft, Camera } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { _patch, _post } from "../../Service/axios";
import { FILE_UPLOAD, UPDATE_PROFILE } from "../../Service/useApiService";
import type {
  FileResponse,
  Media,
  UpdateProfile,
} from "../../Service/interface";
import { useAuth } from "../../ProtectedRoute/AuthProvider";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const countries = getAllCountries();
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [uploadedFile, setUploadedFile] = useState<Media | null>(null);
  const [updateProfile, setUpdateProfile] = useState<UpdateProfile>({
    fullName: user?.fullName || "",
    email: user?.email || "",
    countryCode: user?.countryCode || "",
    mobileNumber: user?.mobileNumber || "",
    // profilePic: user?.profilePic?._id || "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // media upload
  const onImageChangeHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];

    try {
      const payload = new FormData();
      payload.append("medias", file);
      const response = await _post<FileResponse>(FILE_UPLOAD, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadedFile(response.data.data[0]);
      setUpdateProfile((prev) => ({
        ...prev,
        profilePic: response.data.data[0]._id,
      }));
    } catch (error) {
      console.error("Failed to upload", error);
    }
  };

  // handle submit
  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const payload = {
        fullName: updateProfile.fullName,
        email: updateProfile.email,
        countryCode: updateProfile.countryCode,
        mobileNumber: updateProfile.mobileNumber,
        ...(updateProfile.profilePic
          ? { profilePic: updateProfile.profilePic }
          : {}),
      };
      console.log("Update payload:", payload);
      const response = await _patch(UPDATE_PROFILE, payload);
      console.log("Profile Updated successfully", response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white p-4 overflow-x-hidden">
      <div className="min-h-[calc(100vh-2rem)] flex flex-col md:flex-row">
        {/* LEFT SIDE */}
        <div className="w-full md:w-2/4 lg:w-1/4 shrink-0">
          {/* Header */}
          <div className="flex items-center gap-2 ">
            <ArrowLeft
              onClick={() => navigate(-1)}
              className="w-6 h-6 cursor-pointer"
            />
            <p
              onClick={() => setIsEditing(true)}
              className="text-lg font-bold cursor-pointer"
            >
              {isEditing ? "Profile" : "Edit "}
            </p>
          </div>

          {/* Profile */}
          <div className="flex justify-center mt-12 md:mt-16">
            <div className="h-[120px] w-[120px] rounded-full bg-gray-100 relative">
              {uploadedFile?.url ? (
                <img
                  src={uploadedFile.url}
                  alt="Profile"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="h-full w-full rounded-full flex items-center justify-center text-4xl font-semibold text-gray-600">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="absolute right-0 bottom-3">
                <Camera
                  onClick={() => {
                    if (isEditing) {
                      fileRef.current?.click();
                    }
                  }}
                  className={`bg-gray-300 rounded-full p-1 h-[30px] w-[30px] ${
                    isEditing
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-50"
                  }`}
                />
              </span>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={onSubmitHandler}
            className="
            mt-12
            md:mt-16
            flex
            flex-col
            gap-3
            px-4
            sm:px-8
            md:px-8
            lg:px-12
            xl:px-16
          "
          >
            <input
              className="h-[50px] bg-gray-100 w-full px-3 rounded-xl"
              placeholder="Full Name"
              value={updateProfile?.fullName}
              readOnly={!isEditing}
              onChange={(e) =>
                setUpdateProfile({
                  ...updateProfile,
                  fullName: e.target.value,
                })
              }
            />

            <input
              className="h-[50px] bg-gray-100 w-full px-3 rounded-xl"
              placeholder="Email Id"
              value={updateProfile?.email}
              readOnly={!isEditing}
              onChange={(e) =>
                setUpdateProfile({
                  ...updateProfile,
                  email: e.target.value,
                })
              }
            />

            <div className="flex gap-2 w-full">
              <select
                disabled={!isEditing}
                className="h-[50px] w-[60px] lg:w-[90px] bg-gray-100 px-1 rounded-xl"
                value={updateProfile?.countryCode}
                onChange={(e) =>
                  setUpdateProfile({
                    ...updateProfile,
                    countryCode: e.target.value,
                  })
                }
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.code}
                  </option>
                ))}
              </select>

              <input
                className="h-[50px] flex-1 bg-gray-100 px-3 w-full rounded-xl"
                placeholder="Phone Number"
                value={updateProfile?.mobileNumber}
                readOnly={!isEditing}
                onChange={(e) =>
                  setUpdateProfile({
                    ...updateProfile,
                    mobileNumber: e.target.value,
                  })
                }
              />
            </div>
            {isEditing && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#329A93] w-[100px] h-[45px] text-white rounded-xl cursor-pointer"
                >
                  Save
                </button>
              </div>
            )}
          </form>
        </div>

        {/* RIGHT SIDE */}
        <div
          className="
          w-full
          md:w-3/4
          flex
          items-center
          justify-center
          mt-12
          md:mt-0
          md:h-[calc(100vh-2rem)]
        "
        >
          <img
            src={Profilescreen}
            alt="Profile"
            className="
              w-[85%]
              max-w-[500px]
              h-auto
              object-contain

              md:w-[90%]
              md:max-w-[650px]

              lg:max-w-[750px]

              xl:max-w-[900px]
            "
          />
        </div>
      </div>

      <input
        onChange={onImageChangeHandler}
        ref={fileRef}
        type="file"
        hidden
        accept="image/*"
      />
    </div>
  );
};

export default Profile;
