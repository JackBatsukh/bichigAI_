"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TopBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-gray-800">
                Сайн байна уу, Админ
              </h1>
              <p className="text-sm text-gray-500">
                Өнөөдрийн ажлын өдөрт тавтай морилно уу
              </p>
            </div>
          </div>

          <div className="flex max-w-md gap-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Хэрэглэгч хайх..."
                  className="w-full pl-10 text-gray-500 pr-4 py-2 border-3 border-gray-500 rounded-3xl"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
