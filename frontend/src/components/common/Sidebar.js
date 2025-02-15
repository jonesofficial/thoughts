import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser, FaInfoCircle, FaSearch } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "../../constant/url";
import toast from "react-hot-toast";
import { useState } from "react";

const Sidebar = () => {
  const queryClient = useQueryClient();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  // Logout Mutation
  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${baseUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Logout failed!");

      return data;
    },
    onSuccess: () => {
      toast.success("Logged out successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      toast.error(err.message || "An error occurred");
    },
  });

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  // Sidebar Menu Items
  const menuItems = [
    { label: "Home", to: "/", icon: <MdHomeFilled /> },
    { label: "Notifications", to: "/notifications", icon: <IoNotifications /> },
    {
      label: "Profile",
      to: `/profile/${authUser?.username}`,
      icon: <FaUser />,
    },
    { label: "Search", to: "/search", icon: <FaSearch /> },
    { label: "About", to: "/about", icon: <FaInfoCircle /> },
  ];

  // Logout Popup Component
  const LogoutPopup = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-black p-6 rounded-lg text-center">
        <h2 className="text-white text-lg font-bold">Are you sure?</h2>
        <p className="text-gray-400 text-sm mb-4">
          Do you really want to logout?
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => {
              logout();
              setShowLogoutPopup(false);
            }}
          >
            Yes
          </button>
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
            onClick={() => setShowLogoutPopup(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-black w-20 sm:w-16 md:w-52">
      {/* Sidebar Menu */}
      <ul className="flex-1 flex flex-col gap-5 mt-10">
        {menuItems.map(({ label, to, icon }, index) => (
          <li key={index} className="flex justify-center md:justify-start">
            <Link
              to={to}
              className="flex items-center gap-3 hover:bg-stone-900 transition-all rounded-full duration-300 py-2 px-2 md:px-4"
            >
              <div className="text-xl">{icon}</div>
              <span className="hidden md:block text-lg">{label}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Logout Section */}
      {authUser && (
        <div
          className="flex items-center gap-3 p-4 mt-auto hover:bg-[#181818] transition rounded-full cursor-pointer"
          onClick={() => setShowLogoutPopup(true)}
        >
          <div className="hidden md:block w-10 h-10 rounded-full overflow-hidden">
            <img
              src={authUser?.profileImg || "/avatars/profile_placeholder.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden md:flex flex-col">
            <p className="text-white font-bold text-sm truncate">
              {authUser?.fullName}
            </p>
            <p className="text-gray-500 text-xs">@{authUser?.username}</p>
          </div>
          <BiLogOut className="text-xl md:text-lg cursor-pointer text-gray-500" />
        </div>
      )}

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && <LogoutPopup />}
    </div>
  );
};

export default Sidebar;
