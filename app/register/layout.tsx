"use client";
import "../globals.css";
import Footer from "@/components/main/footer";
import dynamic from "next/dynamic";

const Scene = dynamic(() => import("@/components/model/Scene"), { ssr: false });

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="login-page min-h-screen flex flex-col">
      <main className="flex-1 flex items-stretch">
        <div className="w-1/2 flex items-center justify-center p-1 ">
          <div className="w-full max-w-md">{children}</div>
        </div>
        <div className="w-1/2 flex items-center justify-center  relative ">
          <Scene />
        </div>
      </main>
      <Footer />
    </div>
  );
}
