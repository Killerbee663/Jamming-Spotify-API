import React, { useEffect, useState, useRef } from "react";
import SpotifyAPI from "../utilities/SpotifyAPI";
import { FaUser, FaSignOutAlt } from "react-icons/fa";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await SpotifyAPI.getUserProfile();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {

    localStorage.clear();

    SpotifyAPI.logout();

    window.location.reload();
  };

  if (!user) {
    return (
      <div className="h-8 w-8 rounded-full bg-gray-300 animate-pulse"></div>
    );
  }

  return (
    <div
      className="relative"
      ref={dropdownRef}
    >
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        {user.images && user.images.length > 0 ? (
          <img
            src={user.images[0].url}
            alt={user.display_name}
            className="h-8 w-8 rounded-full object-cover ring-2 ring-green-500"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-white">
            <FaUser />
          </div>
        )}
        <span className="text-white hidden sm:block">{user.display_name}</span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium">{user.display_name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          >
            <FaSignOutAlt />
            <span>Log out</span>
          </button>
        </div>
      )}
    </div>
  );
}
