"use client";

import "../globals.css";
import Scene from "@/components/model/Scene";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="login-page min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black">
      <main className="flex-1 flex flex-col lg:flex-row items-stretch">
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-sm sm:max-w-md">{children}</div>
        </div>
        <div className="w-full lg:w-1/2 flex items-center justify-center relative h-[50vh] lg:h-auto">
          <Scene />
        </div>
      </main>
    </div>
  );
}