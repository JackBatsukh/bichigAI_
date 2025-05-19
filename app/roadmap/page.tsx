'use client';

import { useState, useEffect } from "react";
import Nav from "@/components/upload/nav";
import { useRouter } from "next/navigation";

interface RoadmapItem {
  title: string;
  description: string;
  status: "Completed" | "In Progress" | "Planned";
  date?: string;
}

interface AnalyzedData {
  documentTitle: string;
  wordCount: number;
  keyPhrases: string[];
  summary: string;
}

export default function Roadmap() {
  const router = useRouter();
  const [roadmapItems] = useState<RoadmapItem[]>([
    {
      title: "Phase 1: Basic Chat",
      description: "Implement core chat functionality with real-time messaging and user interface.",
      status: "Completed",
      date: "Q1 2025",
    },
    {
      title: "Phase 2: File Upload",
      description: "Add document upload and analysis capabilities for PDF and text files.",
      status: "Completed",
      date: "Q2 2025",
    },
    {
      title: "Phase 3: Multilingual Support",
      description: "Support multiple languages, including Mongolian and English, for broader accessibility.",
      status: "In Progress",
      date: "Q3 2025",
    },
    {
      title: "Phase 4: Advanced AI Features",
      description: "Integrate advanced AI capabilities, such as context-aware responses and enhanced document analysis.",
      status: "Completed",
      date: "Q4 2025",
    },
    {
      title: "Phase 4: Advanced AI Features",
      description: "Integrate advanced AI capabilities, such as context-aware responses and enhanced document analysis.",
      status: "Planned",
      date: "Q4 2025",
    },
    {
      title: "Phase 4: Advanced AI Features",
      description: "Integrate advanced AI capabilities, such as context-aware responses and enhanced document analysis.",
      status: "Planned",
      date: "Q4 2025",
    },
  ]);

  const [analyzedData, setAnalyzedData] = useState<AnalyzedData | null>(null);

  useEffect(() => {
    // Fetch data from localStorage
    const pdfText = localStorage.getItem("pdfText");
    const documentTitle = localStorage.getItem("documentTitle") || "Untitled Document";

    if (pdfText) {
      // Basic analysis
      const words = pdfText.split(/\s+/).filter(word => word.length > 0);
      const wordCount = words.length;

      // Extract key phrases (simple heuristic: frequent non-stop words)
      const stopWords = ["the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of"];
      const wordFreq: { [key: string]: number } = {};
      words.forEach(word => {
        const cleanWord = word.toLowerCase().replace(/[.,!?]/g, "");
        if (!stopWords.includes(cleanWord) && cleanWord.length > 3) {
          wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
        }
      });
      const keyPhrases = Object.entries(wordFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([word]) => word);

      // Generate a simple summary (first 100 words or so)
      const summary = words.slice(0, 100).join(" ") + (words.length > 100 ? "..." : "");

      setAnalyzedData({
        documentTitle,
        wordCount,
        keyPhrases,
        summary,
      });
    }
  }, []);

  return (
    <div className="min-h-screen p-4 sm:p-6 text-white relative bg-gradient-to-b from-gray-900 to-black">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      <div className="max-w-[1440px] mx-auto relative z-10 flex flex-col">
        <Nav />

        <div className="mt-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-center">
            Project Roadmap & Analyzed Data
          </h1>
          <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
            Explore the development journey of our AI-powered chat application and insights from analyzed documents.
          </p>

          {/* Analyzed Data Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4 text-center">
              Analyzed Document Data
            </h2>
            {analyzedData ? (
              <div className="bg-gray-900/80 rounded-lg p-6 shadow-xl backdrop-blur-sm border border-blue-800/30 hover:shadow-blue-900/20 transition-all duration-300">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {analyzedData.documentTitle}
                </h3>
                <p className="text-gray-300 text-sm mb-2">
                  <span className="font-bold">Word Count:</span> {analyzedData.wordCount}
                </p>
                <p className="text-gray-300 text-sm mb-2">
                  <span className="font-bold">Key Phrases:</span>{" "}
                  {analyzedData.keyPhrases.join(", ")}
                </p>
                <p className="text-gray-300 text-sm">
                  <span className="font-bold">Summary:</span> {analyzedData.summary}
                </p>
              </div>
            ) : (
              <div className="bg-gray-900/80 rounded-lg p-6 shadow-xl backdrop-blur-sm border border-blue-800/30 text-center text-gray-400">
                No document data available. Upload a document in the chat interface to see analysis here.
              </div>
            )}
          </div>

          {/* Roadmap Section */}
          <h2 className="text-2xl font-semibold text-white mb-4 text-center">
            Development Roadmap
          </h2>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-blue-700 h-full opacity-50"></div>

            {roadmapItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center mb-12 ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                {/* Timeline Content */}
                <div
                  className={`w-1/2 p-4 ${
                    index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"
                  }`}
                >
                  <div className="bg-gray-900/80 rounded-lg p-5 shadow-xl backdrop-blur-sm border border-blue-800/30 hover:shadow-blue-900/20 transition-all duration-300">
                    <h3 className="text-xl font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="text-gray-300 text-sm mt-2">
                      {item.description}
                    </p>
                    <p className="text-gray-400 text-xs mt-2">
                      Status: {item.status}
                    </p>
                    <p className="text-gray-400 text-xs">
                      Target: {item.date}
                    </p>
                  </div>
                </div>

                {/* Timeline Dot */}
                <div className="w-8 h-8 relative">
                  <div
                    className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${
                      item.status === "Completed"
                        ? "bg-green-500"
                        : item.status === "In Progress"
                        ? "bg-yellow-500"
                        : "bg-gray-500"
                    } shadow-glow`}
                  >
                    <div className="absolute inset-0 rounded-full bg-blue-500 opacity-30 animate-ping"></div>
                  </div>
                </div>

                {/* Spacer */}
                <div className="w-1/2"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Back to Chat Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/chat")}
            className="bg-gradient-custom animate-gradient p-3 rounded-lg text-white shadow-blue hover:bg-gradient-to-br hover:from-pink-500/80 hover:to-purple-600/80 transition"
          >
            Back to Chat
          </button>
        </div>
      </div>
    </div>
  );
}