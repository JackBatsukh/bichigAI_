"use client";

import { usePathname } from "next/navigation";

export default function TopBar() {
  const pathname = usePathname();

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
        </div>
      </div>
    </div>
  );
}
