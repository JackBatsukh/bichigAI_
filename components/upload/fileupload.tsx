"use client";
import React, { useState, useRef } from "react";
import { Upload, FileText, Folder } from "lucide-react";

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  acceptedFileTypes?: string;
  maxFileSize?: number; // in bytes
}

export default function FileUpload({
  onFileSelect,
  acceptedFileTypes = "application/pdf, .docx, .doc",
  maxFileSize = 10 * 1024 * 1024, // 10MB default
}: FileUploadProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showFileSelector, setShowFileSelector] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Check file size
      if (file.size > maxFileSize) {
        setError(`File size exceeds ${maxFileSize / (1024 * 1024)}MB limit`);
        return;
      }

      setSelectedFile(file);
      setShowFileSelector(false);
      onFileSelect?.(file);
    }
  };

  const openFileSelector = () => {
    setShowFileSelector(true);
  };

  const selectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        accept={acceptedFileTypes}
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      {!showFileSelector ? (
        <div
          className={`border-2 border-dashed rounded-md h-80 flex flex-col items-center justify-center cursor-pointer transition-all ${
            isHovering
              ? "bg-gradient-to-br from-blue-600 to-purple-600 bg-opacity-40 border-blue-400"
              : "bg-gradient-to-br from-blue-900 to-purple-900 bg-opacity-30 border-blue-500"
          }`}
          style={{
            boxShadow: isHovering
              ? "0 20px 40px rgba(0, 30, 80, 0.8)"
              : "0 10px 30px rgba(0, 20, 60, 0.7)",
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={selectedFile ? openFileSelector : selectFile}>
          {selectedFile ? (
            <>
              <FileText size={32} className="mb-4 text-blue-300" />
              <p className="text-center mb-1 text-blue-100">
                {selectedFile.name}
              </p>
              <p className="text-center text-sm text-blue-200">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
              <button className="mt-4 text-blue-300 text-sm hover:underline">
                Change file
              </button>
            </>
          ) : (
            <>
              <div
                className="w-16 h-16 rounded-full bg-blue-600 bg-opacity-50 flex items-center justify-center mb-4"
                style={{
                  boxShadow: "0 0 20px rgba(0, 80, 120, 0.7)",
                }}>
                <Upload size={32} className="text-blue-200" />
              </div>
              <p className="text-center mb-1 text-blue-100 font-medium">
                Choose your file to run
              </p>
              <p className="text-center text-blue-200">analyze</p>
              {isHovering && (
                <button
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md hover:from-blue-600 hover:to-purple-600 transition-colors text-white font-medium"
                  style={{
                    boxShadow: "0 5px 20px rgba(0, 30, 70, 0.8)",
                  }}>
                  Select File
                </button>
              )}
            </>
          )}
        </div>
      ) : (
        <div
          className="border-2 border-blue-500 rounded-md h-80 p-4 bg-gradient-to-br from-blue-900 to-purple-900 bg-opacity-30"
          style={{ boxShadow: "0 10px 30px rgba(0, 20, 60, 0.7)" }}>
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-blue-700">
            <h3 className="font-medium text-blue-200">Select a file</h3>
            <button
              onClick={() => setShowFileSelector(false)}
              className="text-blue-300 hover:text-white">
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div
              className="flex flex-col items-center justify-center p-4 border border-blue-700 rounded-md hover:bg-blue-700 hover:bg-opacity-30 cursor-pointer bg-blue-800 bg-opacity-20"
              style={{ boxShadow: "0 5px 15px rgba(0, 30, 70, 0.8)" }}
              onClick={selectFile}>
              <Folder size={40} className="mb-2 text-blue-300" />
              <p className="text-blue-100">Computer</p>
            </div>

            <div
              className="flex flex-col items-center justify-center p-4 border border-blue-700 rounded-md hover:bg-blue-700 hover:bg-opacity-30 cursor-pointer bg-blue-800 bg-opacity-20"
              style={{
                boxShadow: "0 5px 15px rgba(0, 128, 255, 1)",
              }}>
              <Folder size={40} className="mb-2 text-blue-300" />
              <p className="text-blue-100">Desktop</p>
            </div>
          </div>
        </div>
      )}
      {error && (
        <p className="mt-2 text-red-400 text-sm text-center">{error}</p>
      )}
    </div>
  );
}
