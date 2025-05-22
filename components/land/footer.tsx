'use client';

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-10 text-white py-6 mt-8 border-t border-white/10 flex-shrink-0">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <nav aria-label="Footer navigation" className="flex flex-col md:flex-row justify-center items-center gap-6 mb-4">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 min-w-0">
            <Link href="#features" className="text-sm text-white/80 hover:text-white transition">
              Онцлогууд
            </Link>
            <Link href="#how" className="text-sm text-white/80 hover:text-white transition">
              Хэрэглээний заавар
            </Link>
            <Link href="#pricing" className="text-sm text-white/80 hover:text-white transition">
              Төлбөр
            </Link>
          </div>
        </nav>
        <div className="mt-6 text-center text-sm text-white/70">
          <p>© {new Date().getFullYear()} БичигAI. Бүх эрх хуулиар хамгаалагдсан.</p>
        </div>
      </div>
    </footer>
  );
}