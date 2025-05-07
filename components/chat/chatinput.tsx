"use client";

import { useState, useRef } from "react";

interface ChatInputProps {
  onSendMessage: (message: string, file?: File) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !selectedFile) return;
    if (disabled) return;

    onSendMessage(input, selectedFile || undefined);
    setInput("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mt-4 relative">
      {/* Decorative blur shapes */}
      <div className="blur-shape absolute opacity-20 right-0 top-0 scale-50"></div>
      <div className="blur-shape-left absolute opacity-20 left-0 bottom-0 scale-50"></div>

      <form onSubmit={handleSubmit} className="relative glass">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your message..."
          disabled={disabled}
          className="w-full bg-black/20 text-white placeholder-gray-400 rounded-xl p-3 pr-12 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-blue"
        />
        <button
          type="submit"
          disabled={disabled || (!input.trim() && !selectedFile)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-custom animate-gradient p-2 rounded-xl text-white disabled:opacity-50 shadow-glow"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </form>

      <div className="flex gap-4 mt-4 items-center">
        <button
          className="bg-gradient-custom animate-gradient p-3 rounded-full text-white shadow-blue"
          disabled={disabled}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button
          type="button"
          onClick={triggerFileInput}
          className="bg-gradient-custom animate-gradient p-3 rounded-full text-white shadow-blue hover:bg-gradient-to-br hover:from-pink-500/80 hover:to-purple-600/80 transition"
          disabled={disabled}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.828 14.828a4 4 0 004-4v0a4 4 0 00-4-4h0a4 4 0 00-4 4v0a4 4 0 004 4h0z"
            />
          </svg>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,application/pdf,text/plain"
          disabled={disabled}
        />
        {selectedFile && (
          <span className="text-gray-300 text-sm truncate max-w-[150px]">
            {selectedFile.name}
          </span>
        )}
      </div>
    </div>
  );
}