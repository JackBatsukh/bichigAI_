"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "../../components/admin/sidebarCom/sidebar";
import TopBar from "@/components/admin/topBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // useEffect(() => {
  //   if (pathname === "/admin/home") return;

  //   const isAuthenticated = localStorage.getItem("isAuthenticated");
  //   if (!isAuthenticated) {
  //     router.push("/admin/home");
  //   }
  // }, [router, pathname]);

  // if (pathname === "/admin/login") {
  //   return <>{children}</>;
  // }

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col ">
        <main className="flex-1 overflow-y-auto p-4 bg-[linear-gradient(to_bottom_right,#E5E7E7,#D7D8D8)] relative">
          <TopBar />
          <div
            className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0.05)_1.2px,transparent_1px)] [background-size:20px_20px] z-0"
            aria-hidden="true"
          />
          <div className="relative max-w-7xl mx-auto z-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
