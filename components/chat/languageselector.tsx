'use client';

import { useState } from "react";

interface LanguageSelectorProps {
  language: "mn" | "en";
  setLanguage: (lang: "mn" | "en") => void;
}

export default function LanguageSelector({ language, setLanguage }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSelect = (lang: "mn" | "en") => {
    setLanguage(lang);
    setIsOpen(false);
  };
  
  return (
    <div className="relative text-sm text-white flex items-center">
      <span className="mr-2 text-white">Хэлээ сонгоно уу</span>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center bg-gradient-custom animate-gradient text-white px-4 py-1.5 rounded-lg hover:shadow-glow transition shadow-blue"
      >
        {language === "mn" ? "Монгол" : "English"}
        <svg
          className="ml-2 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-lg shadow-lg glass z-10 backdrop-blur-sm">
          <button
            onClick={() => handleSelect("mn")}
            className="block w-full text-left px-4 py-2 text-white hover:bg-blue-800/50 transition"
          >
            Монгол
          </button>
          <button
            onClick={() => handleSelect("en")}
            className="block w-full text-left px-4 py-2 text-white hover:bg-blue-800/50 transition"
          >
            English
          </button>
        </div>
      )}
    </div>
  );
}