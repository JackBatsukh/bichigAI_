"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { HomeIcon, CreditCardIcon, LogOutIcon, Users } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navItems = [
    {
      href: "/admin/home",
      label: "Нүүр",
      icon: <HomeIcon className="w-5 h-5" />,
    },
    {
      href: "/admin/users",
      label: "Хэрэглэгч",
      icon: <Users className="w-5 h-5" />,
    },
    {
      href: "/admin/premium",
      label: "Төлбөрт",
      icon: <CreditCardIcon className="w-5 h-5" />,
    },
  ];

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 ease-in-out fixed inset-y-0 left-0 z-30 shadow-xl`}
      onMouseLeave={() => setHovered(null)}
    >
      <div className="flex flex-col h-full">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1
            className={`logo-font text-2xl  transition-opacity duration-300 ${
              isOpen ? "opacity-100 " : " w-0"
            }`}
          >
            БичигAI
          </h1>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
              />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <div
              key={item.href}
              className="relative"
              onMouseEnter={() => setHovered(item.href)}
            >
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isOpen ? "justify-start" : "justify-center"
                } hover:bg-blue-600 hover:shadow-md active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                aria-label={item.label}
              >
                {item.icon}
                <span
                  className={`text-sm font-medium transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0 hidden"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
              {/* Tooltip for collapsed state */}
              {!isOpen && hovered === item.href && (
                <div className="absolute left-20 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-3 py-1 rounded shadow-lg z-50">
                  {item.label}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="px-4 py-6">
          <button
            onClick={handleSignOut}
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-all duration-200 hover:bg-red-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
              isOpen ? "justify-start" : "justify-center"
            }`}
            aria-label="Sign out"
          >
            <LogOutIcon className="w-5 h-5" />
            <span
              className={`text-sm font-medium transition-opacity duration-300 ${
                isOpen ? "opacity-100" : "opacity-0 hidden"
              }`}
            >
              Гарах
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
