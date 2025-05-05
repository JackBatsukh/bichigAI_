import "../globals.css";
import type { Metadata } from "next";
// import Navbar from "@/components/main/navbar";
// import Lottie from "lottie-react";

export const metadata: Metadata = {
  title: "Analyze AI",
  description: "AI‑powered document insights",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="login-page min-h-screen flex flex-col">
      {/* <Navbar /> */}
      <main className="flex-1 flex items-stretch">
        {/* Left side - Login Form */}
        <div className="w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">{children}</div>
        </div>
        {/* Right side - Lottie Animation */}
        {/* <div className="w-1/2 flex items-center justify-center bg-[#01081d] relative">
          <Lottie
            animationData={require('@/animations/sampleAnimation.json')}
            loop
            style={{ width: "90%", maxWidth: 500, height: "auto" }}
          /> */}
          {/* Replace AnimationComponent with a placeholder or remove it if unnecessary */}
          {/* <AnimationComponent /> */}
        {/* </div> */}
      </main>
    </div>
  );
}
