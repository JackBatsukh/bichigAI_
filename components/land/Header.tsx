'use client';

import { useState } from "react";
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
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6 relative">
        {/* Logo (left-aligned) */}
        <div className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2">
          <div className="text-xl font-extrabold text-white tracking-wide flex items-center gap-2">
            <Link href="/">
              <h1 className="logo-font font-light text-2xl">БичигAI</h1>
            </Link>
          </div>
        </div>

        {/* Mobile menu button (right-aligned on mobile) */}
        <button
          className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 text-white focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Desktop Navigation (centered) */}
        <div className="hidden md:flex justify-center items-center">
          <nav className="flex gap-2 md:gap-4 px-1 py-0.5 rounded-lg border border-cyan-500">
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
          </nav>
          {/* Login button or placeholder (absolute right) */}
          <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2">
            {session ? (
              <div className="w-[100px] h-[36px]"></div> // Placeholder to maintain layout
            ) : (
              <Link
                href="/login"
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition border border-blue-700"
              >
                Нэвтрэх
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu (centered) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0f172a] py-4 px-4 shadow-lg border-t border-cyan-900/40">
          <nav className="flex flex-col space-y-3 items-center text-center">
            <Link
              href="#features"
              className="px-4 py-2 rounded-lg text-white hover:text-cyan-400 transition w-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              Онцлогууд
            </Link>
            <Link
              href="#how"
              className="px-4 py-2 rounded-lg text-white hover:text-cyan-400 transition w-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              Хэрэглээний заавар
            </Link>
            <Link
              href="#pricing"
              className="px-4 py-2 rounded-lg text-white hover:text-cyan-400 transition w-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              Төлбөр
            </Link>
            {!session && (
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition border border-blue-700 text-center mt-2 w-full"
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