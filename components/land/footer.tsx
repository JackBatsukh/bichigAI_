import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-white py-6 mt-8 border-t border-white/10">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
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
        </div>
        <div className="mt-6 text-center text-sm text-white/70">
          <p>&copy; {new Date().getFullYear()} БичигAI. Бүх эрх хуулиар хамгаалагдсан.</p>
        </div>
      </div>
    </footer>
  );
}