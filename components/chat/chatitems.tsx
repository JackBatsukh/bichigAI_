import { useState, useEffect } from "react";
import { Message } from "../../lib/types";
import { Copy, Check, Bot, User, Clock } from "lucide-react";

interface MessageItemProps {
  message: Message;
  timestamp?: string;
}

export default function MessageItem({ message, timestamp }: MessageItemProps) {
  const isUser = message.role === "user";
  const [visible, setVisible] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [typingComplete, setTypingComplete] = useState(isUser);
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
      }, 15); // Slightly slower for better readability
      
      return () => clearInterval(typingInterval);
    }
  }, [message.content, isUser, typingComplete]);

  // Copy to clipboard functionality
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  // Format the message with enhanced styling for different sections
  const formatContent = (content: string): React.ReactNode[] => {
    const lines = content.split('\n');
    const formattedContent: React.ReactNode[] = [];
    let currentSection: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBlockContent = '';

    lines.forEach((line, i) => {
      // Handle code blocks
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          // End of code block
          formattedContent.push(
            <div key={`code-${i}`} className="bg-slate-800 rounded-lg p-4 my-3 overflow-x-auto border border-slate-600">
              <pre className="text-sm text-green-300 font-mono whitespace-pre-wrap">
                {codeBlockContent}
              </pre>
            </div>
          );
          codeBlockContent = '';
          inCodeBlock = false;
        } else {
          // Start of code block
          if (currentSection.length > 0) {
            formattedContent.push(...currentSection);
            currentSection = [];
          }
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent += line + '\n';
        return;
      }

      // Handle different types of content
      if (line.match(/^#{1,6}\s/)) {
        // Headers
        const level = line.match(/^#+/)?.[0].length || 1;
        const text = line.replace(/^#+\s/, '');
        const headerClass = level === 1 ? 'text-xl font-bold text-blue-300 mb-3 mt-4' :
                           level === 2 ? 'text-lg font-semibold text-blue-300 mb-2 mt-3' :
                           'text-base font-medium text-blue-300 mb-2 mt-2';
        
        formattedContent.push(
          <div key={i} className={headerClass}>
            {text}
          </div>
        );
      } else if (line.match(/^(Abstract|Introduction|Conclusion|Results|Methods|Discussion|References|Summary):/i)) {
        // Special sections
        formattedContent.push(
          <div key={i} className="font-bold text-blue-300 mt-4 mb-2 text-lg border-b border-blue-500 pb-1">
            {line}
          </div>
        );
      } else if (line.match(/^\*\s/) || line.match(/^-\s/) || line.match(/^\d+\.\s/)) {
        // List items
        const content = line.replace(/^[\*\-\d+\.]\s/, '');
        formattedContent.push(
          <div key={i} className="flex items-start ml-4 mb-1">
            <span className="text-blue-400 mr-2 mt-1">•</span>
            <span>{content}</span>
          </div>
        );
      } else if (line.match(/^\>\s/)) {
        // Blockquotes
        const content = line.replace(/^\>\s/, '');
        formattedContent.push(
          <div key={i} className="border-l-4 border-blue-500 pl-4 italic text-slate-300 my-2 bg-slate-800/30 py-2 rounded-r">
            {content}
          </div>
        );
      } else if (line.trim() === '') {
        // Empty lines for spacing
        if (formattedContent.length > 0) {
          formattedContent.push(<div key={i} className="mb-2"></div>);
        }
      } else {
        // Regular paragraphs with inline formatting
        const formattedLine = line
          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
          .replace(/\*(.*?)\*/g, '<em class="italic text-slate-200">$1</em>')
          .replace(/`(.*?)`/g, '<code class="bg-slate-700 px-2 py-1 rounded text-green-300 text-sm font-mono">$1</code>');
        
        formattedContent.push(
          <p 
            key={i} 
            className={`${i > 0 && !line.match(/^(#{1,6}|Abstract|Introduction)/i) ? "mt-2" : ""} leading-relaxed`}
            dangerouslySetInnerHTML={{ __html: formattedLine }}
          />
        );
      }
    });

    return formattedContent;
  };

  // Get current time for timestamp
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div 
      className={`mb-6 flex ${isUser ? "justify-end" : "justify-start"} transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="mr-3 flex-shrink-0">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg relative group">
            <div className="absolute inset-0 rounded-full bg-blue-400 opacity-0 group-hover:opacity-30 animate-pulse transition-opacity"></div>
            <Bot size={18} className="relative z-10" />
          </div>
        </div>
      )}
      
      {/* Message Container */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-4xl group`}>
        {/* Message Bubble */}
        <div
          className={`relative px-4 py-3 rounded-2xl shadow-lg transition-all duration-300 ${
            visible ? 'scale-100' : 'scale-95'
          } ${
            isUser
              ? "bg-gradient-to-br from-blue-600 to-blue-700 border border-blue-500/50 text-white shadow-blue-500/25"
              : "bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600/50 text-slate-100 shadow-slate-900/50"
          }`}
          style={{
            boxShadow: isUser 
              ? '0 8px 25px rgba(59, 130, 246, 0.25), 0 0 20px rgba(59, 130, 246, 0.1)' 
              : '0 8px 25px rgba(0, 0, 0, 0.3), 0 0 20px rgba(99, 102, 241, 0.1)'
          }}
        >
          {/* Message Content */}
          <div className="prose prose-invert max-w-none">
            {isUser ? (
              formatContent(message.content)
            ) : (
              formatContent(typingComplete ? message.content : typedText)
            )}
          </div>

          {/* Typing indicator for incomplete messages */}
          {!isUser && !typingComplete && (
            <div className="flex items-center mt-2">
              <div className="typing-dots flex space-x-1">
                <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}

          {/* Shimmer effect for assistant messages */}
          {!isUser && !typingComplete && (
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            </div>
          )}
        </div>

        {/* Message Actions and Timestamp */}
        <div className={`flex items-center mt-2 space-x-2 transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-60'
        }`}>
          {/* Timestamp */}
          <div className="flex items-center text-xs text-slate-400">
            <Clock size={12} className="mr-1" />
            <span>{timestamp || getCurrentTime()}</span>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center text-xs text-slate-400 hover:text-slate-200 transition-colors p-1 rounded hover:bg-slate-700/50"
            title="Copy message"
          >
            {copied ? (
              <>
                <Check size={12} className="mr-1 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={12} className="mr-1" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="ml-3 flex-shrink-0">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold shadow-lg relative group">
            <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-30 animate-pulse transition-opacity"></div>
            <User size={18} className="relative z-10" />
          </div>
        </div>
      )}
    </div>
  );
}