"use client";

import { useState, useEffect, useRef } from "react";
import MessageItem from "./chatitems";
import ChatInput from "./chatinput";
import { Message } from "../../lib/types";
import Nav from "../upload/nav";

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);

  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }

    const initialMessage = localStorage.getItem("initialMessage");
    if (initialMessage) {
      const newMessage: Message = { role: "user", content: initialMessage };
      setMessages((prev) => [...prev, newMessage]);
      localStorage.removeItem("initialMessage");
      handleSendMessage(initialMessage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (isNearBottom) scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      setIsNearBottom(scrollHeight - scrollTop - clientHeight < 150);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const newMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);
    setIsNearBottom(true);

    try {
      const pdfText = localStorage.getItem("pdfText");
      const documentTitle = localStorage.getItem("documentTitle");

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization:
            "Bearer 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",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemma-2-9b-it:free",
          messages: [
            {
              role: "system",
              content: pdfText
                ? `You are analyzing a document titled "${documentTitle}".\n\n${pdfText}`
                : "You are a helpful AI assistant.",
            },
            ...messages,
            newMessage,
          ].map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "No response received.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Failed to get response. Try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 text-white bg-black relative">
      <div className="max-w-[1440px] mx-auto relative z-10 flex flex-col">
        <Nav />

        <div className="flex flex-col mt-24 border border-blue-900/30 bg-black/30 rounded-lg shadow-xl max-h-[90vh] h-[90vh] overflow-hidden">
          {/* Scrollable messages container */}
          <div
            ref={chatContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 space-y-4 border-b border-blue-800/30"
          >
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                No messages yet. Start a conversation!
              </div>
            ) : (
              messages.map((message, index) => (
                <MessageItem key={index} message={message} />
              ))
            )}

            {isLoading && (
              <div className="flex justify-center py-4">
                <div className="animate-pulse flex space-x-2">
                  <div className="h-2 w-2 bg-blue-400 rounded-full" />
                  <div className="h-2 w-2 bg-blue-400 rounded-full animate-pulse delay-75" />
                  <div className="h-2 w-2 bg-blue-400 rounded-full animate-pulse delay-150" />
                </div>
              </div>
            )}
          </div>

          {/* Input bar */}
          <div className="p-4">
            <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
