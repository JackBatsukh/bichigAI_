"use client";
import React from "react";
import { useState, useRef } from "react";
import {
  Upload,
  ChevronDown,
  LogOut,
  User,
  FileText,
  Folder,
} from "lucide-react";
import GradientBackground from "@/components/ui/gradientbg";

export default function UploadPage() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Upload File");
  const [text, setText] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showFileSelector, setShowFileSelector] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const downloadTextAsFile = () => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "analysis-text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setShowFileSelector(false);
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
    <div className="min-h-screen text-white flex-col">
      <div className="min-h-screen w-full absolute z-1 blur-shape">
      </div>
      <div className="blur-shape-left"></div>
      <div className="grid-bg"></div>
      <div className="container mx-auto px-4 py-6 z-10 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-blue-400 font-bold text-2xl">БичигAI</h1>
          <div className="relative">
            <button
              onClick={toggleProfileDropdown}
              className="bg-white bg-opacity-10 rounded-full p-2 hover:bg-opacity-20 transition-all">
              <User size={24} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md py-1 z-10 border border-slate-700 shadow-blue">
                <div className="px-4 py-2 text-sm border-b border-slate-700">
                  jishee@yahoo.com
                </div>
                <button className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-slate-700 transition-colors">
                  <LogOut size={16} className="mr-2" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="flex" style={{ boxShadow: "0 20px 40px rgba(0, 64, 255, 1)" }}>
          {/* Sidebar */}
          <div className="w-64 bg-slate-900 bg-opacity-80 rounded-l-lg">
            <div className="p-4 border-b border-slate-700">
              <h2 className="font-semibold">History</h2>
            </div>
            <div className="py-2">
              <div className="px-4 py-2 text-sm bg-blue-500 bg-opacity-20">
                Today
              </div>
              <div className="px-4 py-2 text-sm hover:bg-slate-800 cursor-pointer">
                Convert pdf to word free
              </div>
              <div className="px-4 py-2 text-sm hover:bg-slate-800 cursor-pointer">
                What is a moonbow
              </div>
              <div className="px-4 py-2 text-sm hover:bg-slate-800 cursor-pointer">
                Recipes with only bread...
              </div>
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 bg-slate-900 bg-opacity-50 rounded-r-lg p-6">
            <h2 className="text-xl font-semibold mb-6">AI analyzer</h2>

            {/* Tabs */}
            <div className="flex mb-6">
              <button
                className={`flex-1 py-3 text-center rounded-l-md border border-slate-700 ${
                  activeTab === "Upload File" ? "bg-slate-800" : "bg-slate-900"
                }`}
                onClick={() => setActiveTab("Upload File")}>
                Upload File
              </button>
              <button
                className={`flex-1 py-3 text-center rounded-r-md border border-slate-700 ${
                  activeTab === "Enter Text" ? "bg-slate-800" : "bg-slate-900"
                }`}
                onClick={() => setActiveTab("Enter Text")}>
                Enter Text
              </button>
            </div>

            {/* Upload or Text Input area */}
            {activeTab === "Upload File" ? (
              <>
                <input
                  type="file"
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
                    style={{ boxShadow: isHovering ? "0 20px 40px rgba(0, 128, 255, 1)" : "0 10px 30px rgba(0, 64, 255, 1)" }}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    onClick={selectedFile ? openFileSelector : selectFile}>
                    {selectedFile ? (
                      <>
                        <FileText size={32} className="mb-4 text-blue-300" />
                        <p className="text-center mb-1 text-blue-100">{selectedFile.name}</p>
                        <p className="text-center text-sm text-blue-200">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                        <button className="mt-4 text-blue-300 text-sm hover:underline">
                          Change file
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-full bg-blue-600 bg-opacity-50 flex items-center justify-center mb-4" style={{ boxShadow: "0 0 20px rgba(0, 255, 255, 1)" }}>
                          <Upload size={32} className="text-blue-200" />
                        </div>
                        <p className="text-center mb-1 text-blue-100 font-medium">
                          Choose your file to run
                        </p>
                        <p className="text-center text-blue-200">analyze</p>
                        {isHovering && (
                          <button className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md hover:from-blue-600 hover:to-purple-600 transition-colors text-white font-medium" style={{ boxShadow: "0 5px 20px rgba(0, 128, 255, 1)" }}>
                            Select File
                          </button>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="border-2 border-blue-500 rounded-md h-80 p-4 bg-gradient-to-br from-blue-900 to-purple-900 bg-opacity-30" style={{ boxShadow: "0 10px 30px rgba(0, 64, 255, 1)" }}>
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
                        style={{ boxShadow: "0 5px 15px rgba(0, 128, 255, 1)" }}
                        onClick={selectFile}>
                        <Folder size={40} className="mb-2 text-blue-300" />
                        <p className="text-blue-100">Computer</p>
                      </div>

                      <div 
                        className="flex flex-col items-center justify-center p-4 border border-blue-700 rounded-md hover:bg-blue-700 hover:bg-opacity-30 cursor-pointer bg-blue-800 bg-opacity-20"
                        style={{ boxShadow: "0 5px 15px rgba(0, 128, 255, 1)" }}>
                        <Folder size={40} className="mb-2 text-blue-300" />
                        <p className="text-blue-100">Desktop</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="border border-slate-700 rounded-md h-80 flex flex-col bg-blue-950 bg-opacity-20" style={{ boxShadow: "0 10px 30px rgba(0, 64, 255, 1)" }}>
                <textarea
                  className="w-full h-full p-4 bg-slate-800 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
                  placeholder="Enter your text here for analysis..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                {text && (
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={downloadTextAsFile}
                      className="text-xs text-blue-400 hover:text-blue-300 flex items-center">
                      Download as text file
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Language selector */}
            <div className="mt-6">
              <select className="bg-slate-900 border border-slate-700 rounded-md px-4 py-2 w-32">
                <option>English</option>
                <option>Монгол</option>
              </select>
            </div>

            {/* Run button */}
            <button 
              className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md py-3 w-full hover:from-blue-700 hover:to-purple-700 transition-colors"
              style={{ boxShadow: "0 10px 30px rgba(0, 64, 255, 1)" }}>
              Run analyze
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}