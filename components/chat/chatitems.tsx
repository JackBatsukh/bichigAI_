import { useState, useEffect } from "react";
import { Message } from "../../lib/types";

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === "user";
  const [visible, setVisible] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [typingComplete, setTypingComplete] = useState(false);

  // Animation for message appearance
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Typing effect for assistant messages
  useEffect(() => {
    if (!isUser && !typingComplete) {
      let index = 0;
      const content = message.content;
      
      const typingInterval = setInterval(() => {
        if (index < content.length) {
          setTypedText(prev => prev + content.charAt(index));
          index++;
        } else {
          clearInterval(typingInterval);
          setTypingComplete(true);
        }
      }, 10); // Speed of typing
      
      return () => clearInterval(typingInterval);
    }
  }, [message.content, isUser]);

  // Format the message with attention to special sections
  const formatContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.match(/^(Abstract|Introduction|Conclusion|Results|Methods)/i)) {
        return <div key={i} className="font-bold text-blue-300">{line}</div>;
      }
      return <p key={i} className={i > 0 ? "mt-2" : ""}>{line}</p>;
    });
  };

  return (
    <div 
      className={`mb-4 flex ${isUser ? "justify-end" : "justify-start"} transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="mr-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-custom animate-gradient text-white shadow-glow relative">
            <div className="absolute inset-0 rounded-full bg-blue-500 opacity-30 animate-ping"></div>
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </div>
      )}
      
      {/* Message Bubble */}
      <div
        className={`max-w-md px-4 py-2 rounded-2xl shadow-lg transition-all duration-300 ${
          visible ? 'scale-100' : 'scale-95'
        } ${
          isUser
            ? "message-bubble-user bg-gradient-to-r from-blue-600 to-blue-700 border border-blue-500"
            : "message-bubble-assistant bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700"
        }`}
      >
        {isUser ? (
          formatContent(message.content)
        ) : (
          typingComplete ? formatContent(message.content) : formatContent(typedText)
        )}
        
        {/* Shimmer effect for assistant messages */}
        {!isUser && (
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="shimmer-effect"></div>
          </div>
        )}
      </div>
      
      {/* User Avatar */}
      {isUser && (
        <div className="ml-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-custom animate-gradient text-white font-bold shadow-glow">
            Б
          </div>
        </div>
      )}
    </div>
  );
}