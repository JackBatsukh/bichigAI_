"use client";

import Link from "next/link";
import MenuIcon from "./menu";
import UsersIcon from "./userIcon";
import AdminPremiumPage from "./Premium";
import { signOut } from "next-auth/react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-gray-800 text-white transition-all duration-300`}
    >
      <div className="flex flex-col w-64 h-screen bg-[#07173C] text-white shadow-lg fixed top-0 left-0">
        <div className="px-6 py-4">
          <h1 className="logo-font text-2xl ">БичигAI</h1>
        </div>
        <nav className="flex-1  py-6 space-y-2">
          <div className="flex items-center  mb-4 gap-4 px-8 py-2 rounded hover:bg-gray-700 transition">
            <MenuIcon />
            <Link href="/admin/home" className="text-[20px]">
              Нүүр
            </Link>
          </div>
          <div className="flex items-center  mb-4 gap-4 px-8 py-2 rounded hover:bg-gray-700 transition">
            <UsersIcon />
            <Link href="/admin/users" className="text-[20px]">
              Хэрэглэгч
            </Link>
          </div>
          <div className="flex items-center  mb-4 gap-4  px-8 py-2 rounded hover:bg-gray-700 transition">
            <AdminPremiumPage />
            <Link href="/admin/premium" className="text-[20px]">
              Төлбөрт
            </Link>
          </div>
        </nav>
        <button onClick={handleSignOut}>
          <h1 className="flex items-center  mb-4 gap-4 px-4 py-2 rounded hover:bg-red-500 transition">
            Гарах
          </h1>
        </button>
      </div>
    </div>
  );
}
