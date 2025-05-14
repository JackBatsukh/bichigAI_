"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0f172a] py-4 shadow-md">
      <div className="mx-auto w-full max-w-7xl flex items-center justify-between px-4 md:px-6">
        <div className="text-xl font-extrabold text-white tracking-wide flex items-center gap-2">
          <Link href="/">
            <h1 className="logo-font text-2xl">БичигAI</h1>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <div className="flex gap-2 md:gap-4 px-1 py-0.5 rounded-lg border border-cyan-500">
            <Link
              href="#features"
              className="px-4 py-2 rounded-lg text-white hover:text-cyan-400 transition"
            >
              Онцлогууд
            </Link>
            <Link
              href="#how"
              className="px-4 py-2 rounded-lg text-white hover:text-cyan-400 transition"
            >
              Хэрэглээний заавар
            </Link>
            <Link
              href="#pricing"
              className="px-4 py-2 rounded-lg text-white hover:text-cyan-400 transition"
            >
              Төлбөр
            </Link>
          </div>
        </nav>

        {/* Login button for desktop */}
        {!session && (
          <Link
            href="/login"
            className="hidden md:block ml-4 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition border border-blue-700"
          >
            Нэвтрэх
          </Link>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0f172a] py-4 px-4 shadow-lg border-t border-cyan-900/40">
          <nav className="flex flex-col space-y-3">
            <Link
              href="#features"
              className="px-4 py-2 rounded-lg text-white hover:text-cyan-400 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Онцлогууд
            </Link>
            <Link
              href="#how"
              className="px-4 py-2 rounded-lg text-white hover:text-cyan-400 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Хэрэглээний заавар
            </Link>
            <Link
              href="#pricing"
              className="px-4 py-2 rounded-lg text-white hover:text-cyan-400 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Төлбөр
            </Link>
            {!session && (
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition border border-blue-700 text-center mt-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Нэвтрэх
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}