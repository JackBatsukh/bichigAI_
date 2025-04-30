"use client";
import FileUpload from "@/components/FileUpload";
import LatestDocument from "@/components/LatestDocument";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full">
        <FileUpload />
        <LatestDocument />
      </div>
    </div>
  );
}
