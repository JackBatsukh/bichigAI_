"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const searchParams = useSearchParams();
  const initialText = searchParams.get("text") || "";

  const [messages, setMessages] = useState<Message[]>(
    initialText ? [{ role: "user", content: initialText }] : []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const callAI = async (chatMessages: Message[]) => {
    setLoading(true);

    const formattedMessages = chatMessages.map((msg) => ({
      role: msg.role,
      content: [
        {
          type: "text",
          text: msg.content,
        },
      ],
    }));

    // Optional: if you want to include an image in the first message
    // if (formattedMessages.length === 1 && formattedMessages[0].role === 'user') {
    //   formattedMessages[0].content.push({
    //     type: 'image_url',
    //     image_url: {
    //       url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg',
    //     },
    //   });
    // }

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization:
        "Bearer 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",
        "Content-Type": "application/json",
        "HTTP-Referer": "localhost:3000",
        "X-Title": "Pdf",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: formattedMessages,
      }),
    });

    const data = await res.json();
    const reply =
      data.choices?.[0]?.message?.content?.[0]?.text || "No response";
    setMessages([...chatMessages, { role: "assistant", content: reply }]);
    setLoading(false);
  };

  useEffect(() => {
    if (initialText) {
      callAI([{ role: "user", content: initialText }]);
    }
  }, [initialText]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: input },
    ];
    setMessages(newMessages);
    setInput("");
    await callAI(newMessages);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="max-w-3xl mx-auto p-4 flex flex-col h-[90vh]">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg max-w-2xl ${
              msg.role === "user"
                ? "bg-gray-800 self-end"
                : "bg-gray-700 self-start"
            }`}>
            <div className="prose whitespace-pre-wrap">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div className="self-start text-gray-500">AI is thinking...</div>
        )}
        <div ref={bottomRef}></div>
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border px-3 py-2 rounded"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-black text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
