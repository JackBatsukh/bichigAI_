"use client";
import "../globals.css";
// import Navbar from "@/components/main/navbar";
import Footer from "@/components/main/footer";
// import Lottie from "lottie-react";
import dynamic from "next/dynamic";

const Scene = dynamic(() => import("@/components/model/Scene"), { ssr: false });

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="login-page min-h-screen flex flex-col">
      {/* <Navbar /> */}
      <main className="flex-1 flex items-stretch">
        {/* Left side - Register Form */}
        <div className="w-1/2 flex items-center justify-center p-1 ">
          <div className="w-full max-w-md">{children}</div>
        </div>
        {/* Right side - Lottie Animation */}
        <div className="w-1/2 flex items-center justify-center  relative ">
          <Scene />
          {/* <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent pointer-events-none"></div> */}
        </div>
      </main>
      <Footer />
    </div>
  );
}
