// src/components/UserAccount.tsx
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MdOutlineShoppingBag } from "react-icons/md";
import { CgLogOut, CgProfile } from "react-icons/cg";
import { useRecoilValue, useRecoilState } from "recoil";
import toast from "react-hot-toast";
import {
  authStateAtom,
  userInfoAtom,
  dropDownVisibleAtom,
} from "../state/state";
import axios from "axios";

const UserAccount: React.FC = () => {
  const isLoggedIn = useRecoilValue(authStateAtom);

  return <div className="relative">{isLoggedIn ? <UserDropdown /> : <GuestLoginButton />}</div>;
};

export default UserAccount;

const GuestLoginButton = () => (
  <Link to="/login" className="text-white hidden md:block">
    <img
      src="/user.png"
      alt="Guest"
      className="w-8 h-8 rounded-full object-cover"
    />
  </Link>
);

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useRecoilState(dropDownVisibleAtom);
  const userInfo = useRecoilValue(userInfoAtom);
  const dropdownRef = useRef<HTMLDivElement>(null);
  console.log("👤 userInfo in dropdown:", userInfo); // 👈 ADD THIS HERE
  if (!userInfo?.name || !userInfo?.email) {
    return null;
  }
  
  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOutsideClick = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_domainName}/auth/logout`, {
        withCredentials: true,
      });
      toast.success("Logged out successfully");
      window.location.reload();
    } catch (err) {
      toast.error("Logout failed. Try again.");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div ref={dropdownRef} onClick={toggleDropdown} className="hidden md:block">
      <img
        src={userInfo.photo || "/user.png"}
        alt="profile"
        className="w-8 h-8 rounded-full object-cover cursor-pointer"
      />
      {isOpen && (
        <div className="absolute right-0 mt-3 w-[260px] bg-black border border-gray-800 rounded-md text-white shadow-lg z-50 divide-y divide-gray-700">
          <div className="flex items-center p-4">
            <img
              src={userInfo.photo || "/user.png"}
              alt="profile"
              className="w-8 h-8 rounded-full mr-3"
            />
            <div>
              <div className="font-semibold text-sm">{userInfo.name}</div>
              <div className="text-xs text-gray-400 truncate">{userInfo.email}</div>
            </div>
          </div>
          <div className="p-2 space-y-2">
            <Link to="#" className="flex items-center hover:text-gray-400">
              <CgProfile size={20} className="mr-2" />
              Profile
            </Link>
            <Link to="#" className="flex items-center hover:text-gray-400">
              <MdOutlineShoppingBag size={20} className="mr-2" />
              My Orders
            </Link>
          </div>
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="flex items-center text-red-500 hover:text-red-700 w-full"
            >
              <CgLogOut size={20} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
