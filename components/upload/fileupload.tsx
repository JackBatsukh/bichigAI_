"use client";
import React, { useRef, useState } from "react";
import { Upload, FileText, Folder } from "lucide-react";

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  acceptedFileTypes?: string;
  maxFileSize?: number; // bytes
}

export default function FileUpload({
  onFileSelect,
  acceptedFileTypes = "application/pdf, .docx, .doc",
  maxFileSize = 10 * 1024 * 1024, // 10MB
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxFileSize) {
      setError(
        `File size exceeds ${(maxFileSize / 1024 / 1024).toFixed(1)}MB limit`
      );
      return;
    }

    setSelectedFile(file);
    onFileSelect?.(file);
  };

  const openFileDialog = () => fileInputRef.current?.click();

  const baseStyle =
    "w-full border-2 border-dashed rounded-md h-60 md:h-80 flex flex-col items-center justify-center transition-all cursor-pointer";
  const bgStyle = isHovering
    ? "bg-gradient-to-br from-blue-600 to-purple-600 bg-opacity-40 border-blue-400"
    : "bg-gradient-to-br from-blue-900 to-purple-900 bg-opacity-30 border-blue-500";
  const boxShadow = isHovering
    ? "0 20px 40px rgba(0, 30, 80, 0.8)"
    : "0 10px 30px rgba(0, 20, 60, 0.7)";

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        accept={acceptedFileTypes}
        className="hidden"
        onChange={handleFileChange}
      />

      <div
        className={`${baseStyle} ${bgStyle}`}
        style={{ boxShadow }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={openFileDialog}>
        {selectedFile ? (
          <>
            <FileText size={24} className="mb-2 md:mb-4 text-blue-300" />
            <p className="text-center mb-1 text-blue-100 text-sm md:text-base">
              {selectedFile.name}
            </p>
            <p className="text-center text-xs md:text-sm text-blue-200">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
            <button className="mt-2 md:mt-4 text-blue-300 text-xs md:text-sm hover:underline">
              Change file
            </button>
          </>
        ) : (
          <>
            <div
              className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-600 bg-opacity-50 flex items-center justify-center mb-2 md:mb-4"
              style={{ boxShadow: "0 0 20px rgba(0, 80, 120, 0.7)" }}>
              <Upload size={20} className="text-blue-200 md:hidden" />
              <Upload size={32} className="text-blue-200 hidden md:block" />
            </div>
            <p className="text-center text-blue-100 font-medium text-sm md:text-base">
              Choose your file to run
            </p>
            <p className="text-center text-blue-200 text-xs md:text-sm">
              analyze
            </p>
            {isHovering && (
              <button
                className="mt-3 md:mt-4 px-4 md:px-6 py-1 md:py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md hover:from-blue-600 hover:to-purple-600 transition-colors text-white font-medium text-xs md:text-base"
                style={{ boxShadow: "0 5px 20px rgba(0, 30, 70, 0.8)" }}>
                Select File
              </button>
            )}
          </>
        )}
      </div>

      {error && (
        <p className="mt-2 text-red-400 text-xs md:text-sm text-center">
          {error}
        </p>
      )}
    </div>
  );
}
