"use client";

import { useState, useEffect, useRef } from "react";
import MessageItem from "./chatitems";
import ChatInput from "./chatinput";
import LanguageSelector from "./languageselector";
import { Message } from "../../lib/types";
import Nav from "../upload/nav";

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load chat history and check for initial message
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }

    // Check for initial message from upload
    const initialMessage = localStorage.getItem("initialMessage");
    if (initialMessage) {
      // Add the initial message
      const newMessage: Message = {
        role: "user",
        content: initialMessage,
      };
      setMessages((prev) => [...prev, newMessage]);

      // Clear the initial message
      localStorage.removeItem("initialMessage");

      // Automatically send to AI
      handleSendMessage(initialMessage);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  // Handle auto-scrolling when messages change or loading state changes
  useEffect(() => {
    if (isNearBottom) {
      scrollToBottom();
    }
  }, [messages, isLoading, isNearBottom]);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const scrollOptions = {
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth" as ScrollBehavior,
      };
      chatContainerRef.current.scrollTo(scrollOptions);
    }
  };

  // Handle scroll events to determine if user manually scrolled up
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      // If we're near the bottom (within 150px), enable auto-scrolling
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
      setIsNearBottom(isNearBottom);
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
          "X-Title": "Document AI Chat",
          "HTTP-Referer": "http://localhost:3000",
        },
        body: JSON.stringify({
          model: "google/gemma-2-9b-it:free",
          messages: [
            {
              role: "system",
              content: pdfText
                ? `You are analyzing a document titled "${documentTitle}". Here is the content:\n\n${pdfText}\n\nPlease provide detailed and accurate responses based on this content. If the user asks about the document, use this content to answer their questions.`
                : "You are a helpful AI assistant. Please provide detailed and accurate responses.",
            },
            ...messages,
            newMessage,
          ].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to get response");
      }

      const data = await res.json();

      if (!data.choices?.[0]?.message?.content) {
        throw new Error("Invalid response");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.choices[0].message.content },
      ]);

      localStorage.setItem(
        "chatMessages",
        JSON.stringify([
          ...messages,
          newMessage,
          { role: "assistant", content: data.choices[0].message.content },
        ])
      );
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't process that. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat history
  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem("chatHistory");
  };

  return (
    <div className="min-h-screen text-white p-6 relative">
      {/* Background grid lines */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 pointer-events-none">
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

      <div className="max-w-[1440px] mx-auto relative z-10">
        <Nav />

        <div className="bg-black/30 border border-blue-900/30 rounded-lg h-fit max-h-[950px] shadow-xl p-6 mt-[100px]">
          <div
            ref={chatContainerRef}
            onScroll={handleScroll}
            className="border border-blue-800/30 rounded-lg p-4 mb-6 h-[600px] overflow-y-auto bg-black/20 shadow-lg">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                No messages yet. Start a conversation!
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <MessageItem key={index} message={message} />
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex justify-center items-center py-4">
                <div className="animate-pulse flex items-center space-x-2">
                  <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                  <div className="h-2 w-2 bg-blue-400 rounded-full animate-pulse delay-75"></div>
                  <div className="h-2 w-2 bg-blue-400 rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            )}
          </div>

          <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}
