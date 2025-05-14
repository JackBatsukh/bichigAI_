"use client";

import React, { useState, useEffect, MouseEvent as ReactMouseEvent } from "react";
import { User, LogOut, Sparkles, Menu, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

const Nav: React.FC = () => {
  const { data: session } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isPremiumClicked, setIsPremiumClicked] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  // Handle window resize
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
        // Close mobile menu on large screens
        if (window.innerWidth >= 768) {
          setIsMobileMenuOpen(false);
        }
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isProfileOpen && !target.closest(".profile-dropdown-container")) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handlePremiumClick = () => {
    setIsPremiumClicked(true);
    setShowPremiumModal(true);
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    setTimeout(() => setIsPremiumClicked(false), 300);
  };

  const closePremiumModal = () => {
    setShowPremiumModal(false);
  };

  return (
    <div className="relative">
      {/* Main Nav Bar */}
      <div className="flex justify-between items-center mb-6 md:mb-12 relative px-4 py-3 md:py-4">
        <div className="flex items-center">
          <h1 className="text-blue-400 font-bold text-xl md:text-2xl">БичигAI</h1>
          <span className="ml-1 text-yellow-400">
            <Sparkles size={windowWidth < 768 ? 14 : 16} />
          </span>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-gray-300 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Profile Button */}
        <div className="relative hidden md:block profile-dropdown-container">
          <button
            onClick={toggleProfileDropdown}
            className="bg-opacity-10 rounded-full p-2 hover:bg-opacity-20 transition-all"
            aria-label="Profile menu"
          >
            <User size={24} />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md py-1 z-10 border border-slate-700 shadow-lg">
              <div className="px-4 py-2 text-sm border-b border-slate-700 truncate">
                {session?.user.email}
              </div>
              <button
                className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-slate-700 transition-colors"
                onClick={handlePremiumClick}
              >
                <Sparkles size={16} className="mr-2 text-yellow-400" />
                Премиум хэрэглэгч
              </button>
              <button
                className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-slate-700 transition-colors"
                onClick={handleSignOut}
              >
                <LogOut size={16} className="mr-2" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          className="md:hidden fixed inset-x-0 top-14 bg-slate-800 border-t border-slate-700 shadow-lg z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="px-4 py-3 border-b border-slate-700">
            <div className="text-sm truncate">
              {session?.user.email}
            </div>
          </div>
          <div className="py-2">
            <button
              className="flex items-center w-full text-left px-4 py-3 hover:bg-slate-700"
              onClick={handlePremiumClick}
            >
              <Sparkles size={16} className="mr-3 text-yellow-400" />
              <span>Премиум хэрэглэгч</span>
            </button>
            <button
              className="flex items-center w-full text-left px-4 py-3 hover:bg-slate-700"
              onClick={handleSignOut}
            >
              <LogOut size={16} className="mr-3" />
              <span>Log out</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Premium Purchase Modal */}
      {showPremiumModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}>
          <motion.div
            className="bg-slate-800 border border-slate-700 rounded-lg p-4 md:p-6 w-full max-w-md relative"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            exit={{ y: 50 }}
            transition={{ duration: 0.4 }}>
            <button
              onClick={closePremiumModal}
              className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <div className="flex items-center mb-4">
              <span className="bg-yellow-400 p-1 md:p-2 rounded-full mr-2 md:mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={windowWidth < 768 ? "20" : "24"}
                  height={windowWidth < 768 ? "20" : "24"}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-black">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
                </svg>
              </span>
              <h2 className="text-lg md:text-xl font-bold text-white">
                Премиум хэрэглэгч болох
              </h2>
            </div>

            <div className="mb-5">
              <div className="text-xl md:text-2xl font-bold text-yellow-400 mb-2">
                ₮10,000 / сар
              </div>
              <p className="text-white/80 text-xs md:text-sm mb-4">
                Бүх премиум онцлогуудыг ашиглана уу
              </p>

              <div className="bg-slate-700 rounded-lg p-3 md:p-4 mb-4">
                <h3 className="font-medium text-white text-sm md:text-base mb-2">
                  Дансны мэдээлэл
                </h3>
                <p className="text-white/80 text-xs md:text-sm">
                  Банк: Хаан Банк<br />
                  Дансны дугаар: 5619400116<br />
                  Хүлээн авагч: БичигAI ХХК
                </p>
              </div>

              <p className="text-white/80 text-xs md:text-sm mb-4">
                Дээрх дансанд шилжүүлэг хийсний дараа имэйл хаягаа оруулж
                баталгаажуулна уу.
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-xs md:text-sm font-medium text-white mb-1">
                И-мэйл хаяг
              </label>
              <input
                type="email"
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                placeholder="example@mail.com"
              />
            </div>

            <div className="flex flex-col space-y-3">
              <motion.button
                className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded text-sm md:text-base"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 0 12px rgba(255, 215, 0, 0.7)",
                }}
                transition={{ duration: 0.2 }}>
                Баталгаажуулах
              </motion.button>
              <button
                onClick={closePremiumModal}
                className="w-full py-2 bg-transparent border border-slate-600 hover:bg-slate-700 text-white font-medium rounded text-sm md:text-base"
              >
                Цуцлах
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Nav;