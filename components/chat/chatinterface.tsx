"use client";

import { useState, useEffect, useRef } from "react";
import MessageItem from "./chatitems";
import ChatInput from "./chatinput";
import LanguageSelector from "./languageselector";
import { Message } from "../../lib/types";

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "user",
      content:
        "Abstract\nThe Quantum Drift Effect explores theoretical deviations in subatomic particle behavior when exposed to oscillating fields within microgravity environments. This phenomenon, though still unproven in practice, has implications for quantum computing and long-distance space travel.\nIntroduction",
    },
    {
      role: "assistant",
      content: "Ok now I'm excited lol. Catch y'all in a few episodes.",
    },
    {
      role: "user",
      content: "Ok thank you for using bichig AI",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<"mn" | "en">("en");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const newMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, newMessage]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, newMessage],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error: Could not get a response. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000014] text-white p-6 relative ">
      {/* Background grid lines */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 pointer-events-none ">
        {Array(12)
          .fill(0)
          .map((_, i) => (
            <div key={`col-${i}`} className="border-r border-blue-900/20"></div>
          ))}
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={`row-${i}`} className="border-b border-blue-900/20"></div>
          ))}
      </div>

      {/* Random pink gradient blur-shape spots */}


      <div className="max-w-4xl mx-auto relative z-10 ">
        <h1 className="text-blue-300 font-bold text-2xl mb-6 px-2">БичигAI</h1>

        <div className=" bg-black/30 border border-blue-900/30 rounded-lg shadow-xl p-6 ">
          <div className="flex justify-between items-center mb-6 blur-shape-budeg">
            <h2 className="text-white font-medium">Analyzed Documents</h2>
            <LanguageSelector language={language} setLanguage={setLanguage} />
          </div>

          <div
            ref={chatContainerRef}
            className="border border-blue-800/30 rounded-lg p-4 mb-6 max-h-[400px] overflow-y-auto bg-black/20  shadow-lg"
          >
            {messages.map((message, index) => (
              <MessageItem key={index} message={message} />
            ))}

            {loading && (
              <div className="flex justify-center items-center py-4">
                <div className="animate-pulse flex items-center space-x-2">
                  <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                  <div className="h-2 w-2 bg-blue-400 rounded-full animate-pulse delay-75"></div>
                  <div className="h-2 w-2 bg-blue-400 rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            )}
          </div>

          <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
        </div>
      </div>
    </div>
  );
}