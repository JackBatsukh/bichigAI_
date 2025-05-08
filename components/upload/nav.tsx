"use client";

import React, { useState } from "react";
import { User, LogOut, Sparkles, CreditCard } from "lucide-react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

const Nav = () => {
  const { data: session } = useSession();
  console.log(session);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isPremiumClicked, setIsPremiumClicked] = useState(false); // Track if Premium was clicked

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

  const handlePremiumClick = () => {
    setIsPremiumClicked(true); // Set clicked state to true
    setShowPremiumModal(true);
    setIsProfileOpen(false);
    setTimeout(() => setIsPremiumClicked(false), 300); // Reset clicked state after animation duration
  };

  const closePremiumModal = () => {
    setShowPremiumModal(false);
  };

  return (
    <div className="flex justify-between items-center mb-12 relative">
      <div className="flex items-center">
        <h1 className="text-blue-400 font-bold text-2xl">БичигAI</h1>
        <span className="ml-1 text-yellow-400">
          <Sparkles size={16} />
        </span>
      </div>

      <div className="relative">
        <button
          onClick={toggleProfileDropdown}
          className=" bg-opacity-10 rounded-full p-2 hover:bg-opacity-20 transition-all">
          <User size={24} />
        </button>

        {isProfileOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md py-1 z-10 border border-slate-700 shadow-blue">
            <div className="px-4 py-2 text-sm border-b border-slate-700">
              {session?.user.email}
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

      {/* Premium Purchase Modal */}
      {showPremiumModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-md w-full mx-4 relative"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            exit={{ y: 50 }}
            transition={{ duration: 0.4 }}
          >
            <button
              onClick={closePremiumModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <div className="flex items-center mb-4">
              <span className="bg-yellow-400 p-2 rounded-full mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-black"
                >
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
                </svg>
              </span>
              <h2 className="text-xl font-bold text-white">
                Премиум хэрэглэгч болох
              </h2>
            </div>

            <div className="mb-6">
              <div className="text-2xl font-bold text-yellow-400 mb-2">
                ₮10,000 / сар
              </div>
              <p className="text-white/80 text-sm mb-4">
                Бүх премиум онцлогуудыг ашиглана уу
              </p>

              <div className="bg-slate-700 rounded-lg p-4 mb-4">
                <h3 className="font-medium text-white mb-2">
                  Дансны мэдээлэл
                </h3>
                <p className="text-white/80 text-sm">
                  Банк: Хаан Банк<br />
                  Дансны дугаар: 5619400116<br />
                  Хүлээн авагч: БичигAI ХХК
                </p>
              </div>

              <p className="text-white/80 text-sm mb-4">
                Дээрх дансанд шилжүүлэг хийсний дараа имэйл хаягаа оруулж
                баталгаажуулна уу.
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-1">
                И-мэйл хаяг
              </label>
              <input
                type="email"
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white"
                placeholder="example@mail.com"
              />
            </div>

            <div className="flex flex-col space-y-3">
              <motion.button
                className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 15px rgba(255, 215, 0, 0.9)",
                }}
                transition={{ duration: 0.2 }}
              >
                Баталгаажуулах
              </motion.button>
              <button
                onClick={closePremiumModal}
                className="w-full py-2 bg-transparent border border-slate-600 hover:bg-slate-700 text-white font-medium rounded"
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
