import { getAllCountries } from "country-code-data";
import Profilescreen from "../../assets/profilescreen.svg";
import { ArrowLeft, Camera } from "lucide-react";

const Profile = () => {
  const countries = getAllCountries();

  return (
    <div className="min-h-screen w-full bg-white p-4 overflow-x-hidden">

      <div className="min-h-[calc(100vh-2rem)] flex flex-col md:flex-row">

        {/* LEFT SIDE */}
        <div className="w-full md:w-2/4 lg:w-1/4 shrink-0">

          {/* Header */}
          <div className="flex items-center gap-1">
            <ArrowLeft className="w-6 h-6" />
            <p className="text-lg font-bold">Edit</p>
          </div>

          {/* Profile */}
          <div className="flex justify-center mt-12 md:mt-16">
            <div className="h-[120px] w-[120px] rounded-full bg-gray-100 relative">

              <span className="absolute right-0 bottom-3">
                <Camera className="bg-gray-300 rounded-full p-1 h-[30px] w-[30px]" />
              </span>

            </div>
          </div>

          {/* Form */}
          <div className="
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
          ">

            <input
              className="h-[50px] bg-gray-100 w-full px-3"
              placeholder="Full Name"
            />

            <input
              className="h-[50px] bg-gray-100 w-full px-3"
              placeholder="Email Id"
            />

            <div className="flex gap-2 w-full">

              <select className="h-[50px] w-[60px] lg:w-[90px] bg-gray-100 px-1">
                {countries.map((country) => (
                  <option
                    key={country.code}
                    value={country.code}
                  >
                    {country.code}
                  </option>
                ))}
              </select>

              <input
                className="h-[50px] flex-1 bg-gray-100 px-3 w-full"
                placeholder="Phone Number"
              />

            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="
          w-full
          md:w-3/4
          flex
          items-center
          justify-center
          mt-12
          md:mt-0
          md:h-[calc(100vh-2rem)]
        ">

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
    </div>
  );
};

export default Profile;