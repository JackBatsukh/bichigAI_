"use client";

import { useState, useEffect, useRef } from "react";
import MessageItem from "./chatitems";
import ChatInput from "./chatinput";
import { Message } from "../../lib/types";
import Nav from "../upload/nav";

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage");
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
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
    if (isNearBottom) scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
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
          model: "google/gemma-3-27b-it:free",
          messages: [
            {
              role: "system",
              content: pdfText
                ? selectedLanguage === "mn"
                  ? `Та "${documentTitle}" баримт бичгийг шинжилж байна. Энэ бол агуулга:\n\n${pdfText}\n\nЭнэ агуулгад үндэслэн дэлгэрэнгүй, үнэн зөв хариулт өгнө үү. Хэрэглэгч баримт бичгийн талаар асуувал, энэ агуулгыг ашиглан хариулна уу.`
                  : `You are analyzing a document titled "${documentTitle}". Here is the content:\n\n${pdfText}\n\nPlease provide detailed and accurate responses based on this content. If the user asks about the document, use this content to answer their questions.`
                : selectedLanguage === "mn"
                ? "Та тусламж үзүүлэх AI ассистент юм. Дэлгэрэнгүй, үнэн зөв хариулт өгнө үү."
                : "You are a helpful AI assistant. Please provide detailed and accurate responses.",
            },
            ...messages,
            newMessage,
          ].map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error || `API request failed with status ${res.status}`
        );
      }

      const data = await res.json();
      console.log("API Response:", data); // Debug log to see the actual response

      // More detailed validation of the response structure
      if (!data || typeof data !== "object") {
        throw new Error("Invalid API response: response is not an object");
      }

      // Check if the response has the expected structure
      if (!data.choices) {
        console.error("API Response missing choices:", data);
        throw new Error("Invalid API response: missing choices field");
      }

      // Ensure choices is an array and has at least one item
      if (!Array.isArray(data.choices) || data.choices.length === 0) {
        console.error("Invalid choices format:", data.choices);
        throw new Error(
          "Invalid API response: choices must be a non-empty array"
        );
      }

      const firstChoice = data.choices[0];
      if (!firstChoice || typeof firstChoice !== "object") {
        console.error("Invalid first choice format:", firstChoice);
        throw new Error("Invalid API response: first choice is not an object");
      }

      const message = firstChoice.message;
      if (!message || typeof message !== "object") {
        console.error("Invalid message format:", message);
        throw new Error("Invalid API response: message is not an object");
      }

      if (!message.content || typeof message.content !== "string") {
        console.error("Invalid message content:", message.content);
        throw new Error(
          "Invalid API response: message content is not a string"
        );
      }

      const reply = message.content;
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (error) {
      console.error("Chat API Error:", error);
      const errorMessage =
        selectedLanguage === "mn"
          ? "Уучлаарай, хариулт өгөх боломжгүй байна. Дахин оролдоно уу."
          : "Sorry, I couldn't process that. Please try again.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMessage },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 text-white  relative">
      <div className="max-w-[1440px] mx-auto relative z-10 flex flex-col">
        <Nav />

        <div className="flex flex-col  border border-blue-900/30 bg-black/30 rounded-lg shadow-xl max-h-[80vh] h-[80vh] overflow-hidden">
          <div
            ref={chatContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 space-y-4  border-b border-blue-800/30">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                {selectedLanguage === "mn"
                  ? "Харилцаа эхлээгүй байна. Яриа эхлүүлнэ үү!"
                  : "No messages yet. Start a conversation!"}
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

          <div className="p-4">
            <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
