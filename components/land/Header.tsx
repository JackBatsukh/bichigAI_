"use client";
import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  return (
    <header className="sticky top-0 z-50 w-full bg-[#0f172a] py-4 shadow-md">
      <div className="mx-auto w-full max-w-7xl flex items-center justify-between px-3 md:px-4">
        <div className="text-xl font-extrabold text-white tracking-wide flex items-center gap-2">
          <Link href="/">
            {/* <span className="logo-font bg-gradient-to-r from-blue-400 to-blu/e-700 text-transparent bg-clip-text cursor-pointer"> */}
            <div className="logo-font ">
              БичигAI
            </div>
          </Link>
        </div>

        <nav>
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
        {session ? (
          <Link
            href="/login"
            className="ml-4 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition border border-blue-700"
          >
            Нэвтрэх
          </Link>
        ):<div></div>}
      </div>
    </header>
  );
}
