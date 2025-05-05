"use client";

import { useState, useEffect, useRef } from "react";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const savedText = localStorage.getItem("pdfText");
    if (savedText) {
      const prompt = `Here is a PDF I uploaded:\n\n${savedText}\n\nPlease summarize it in Mongolian.`;
      setInput(prompt);
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
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
          model: "google/gemma-3-27b-it:free",
          messages: [...messages, newMessage],
        }),
      });

      const data = await res.json();
      const aiResponse =
        data.choices?.[0]?.message?.content || "No response from AI";

      const formattedResponse = aiResponse
        .split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0)
        .map((line: string) => {
          // Format headings
          if (line.startsWith('## ')) {
            return `\n## ${line.slice(3)}\n`;
          }
          if (line.startsWith('### ')) {
            return `\n### ${line.slice(4)}\n`;
          }
          // Format lists
          if (line.startsWith('- ') || line.startsWith('* ')) {
            return `\n• ${line.slice(2)}`;
          }
          // Format code blocks
          if (line.startsWith('```')) {
            return `\n${line}\n`;
          }
          return line;
        })
        .join('\n\n');

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: formattedResponse },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Error contacting AI API." },
      ]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 text-xl font-semibold text-center shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          PDF Chat Assistant
        </div>
      </header>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-4xl mx-auto w-full" ref={chatRef}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-xl mx-auto px-4 py-3 rounded-lg shadow-sm transition-all duration-200 ${
              msg.role === "user"
                ? "bg-blue-500 text-white ml-auto hover:bg-blue-600"
                : "bg-white border border-gray-200 text-gray-800 mr-auto hover:bg-gray-50"
            }`}
          >
            <div className="prose prose-sm max-w-none">
              {msg.content.split('\n').map((line, i) => {
                if (line.startsWith('## ')) {
                  return <h2 key={i} className="text-lg font-bold mt-4 mb-2">{line.slice(3)}</h2>;
                }
                if (line.startsWith('### ')) {
                  return <h3 key={i} className="text-base font-semibold mt-3 mb-1">{line.slice(4)}</h3>;
                }
                if (line.startsWith('• ')) {
                  return <li key={i} className="ml-4">{line.slice(2)}</li>;
                }
                if (line.startsWith('```')) {
                  return <pre key={i} className="bg-gray-100 p-2 rounded mt-2 mb-2 overflow-x-auto">{line}</pre>;
                }
                return <p key={i} className="mb-2">{line}</p>;
              })}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-center text-sm text-gray-500 animate-pulse flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            БичигAI боловсруулж байна...
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-4 border-t bg-white shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something about the PDF..."
            rows={2}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-1 p-3 border border-gray-300 rounded-lg resize-none text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            aria-busy={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            илгээх
          </button>
        </div>
      </div>
    </div>
  );
}
