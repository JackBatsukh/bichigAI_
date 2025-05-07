"use client";
import React, { useState } from "react";
import { User, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const Nav = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };
  return (
    <div className="flex justify-between items-center mb-12">
      <h1 className="text-blue-400 font-bold text-2xl">БичигAI</h1>
      <div className="relative">
        <button
          onClick={toggleProfileDropdown}
          className="bg-white bg-opacity-10 rounded-full p-2 hover:bg-opacity-20 transition-all">
          <User size={24} />
        </button>

        {isProfileOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md py-1 z-10 border border-slate-700 shadow-blue">
            <div className="px-4 py-2 text-sm border-b border-slate-700">
              jishee@yahoo.com
            </div>
            <button
              className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-slate-700 transition-colors"
              onClick={handleSignOut}>
              <LogOut size={16} className="mr-2" />
              Log out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nav;
