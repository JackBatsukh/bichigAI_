import "../globals.css";
import type { Metadata } from "next";
import Scene from "@/components/model/Scene";

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
      <main className="flex-1 flex items-stretch">
        <div className="w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">{children}</div>
        </div>
        <div className="w-1/2 flex items-center justify-center  relative ">
          <Scene />
        </div>
      </main>
    </div>
  );
}
