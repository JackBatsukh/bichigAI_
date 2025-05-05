// components/Footer.tsx
import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className=" text-white py-4 mt-8">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="flex justify-center space-x-8">
          
        </div>
        <div className="mt-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} БичигAI. Бүх эрх хуулиар хамгаалагдсан.</p>
        </div>
      </div>
    </footer>
  );
}
