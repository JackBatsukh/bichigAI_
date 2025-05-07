import { Message } from "../../lib/types"

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === "user";
  
  return (
    <div className={`mb-4 flex ${isUser ? "justify-end" : "justify-start"}`}>
      {/* Message Bubble with Avatar */}
      {!isUser && (
        <div className="mr-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-custom animate-gradient text-white shadow-glow">
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
      
      <div
        className={`max-w-md px-4 py-2 rounded-2xl shadow glass
          ${isUser
            ? "message-bubble-user"
            : "message-bubble-assistant"
          }`}
      >
        {message.content.split('\n').map((line, i) => {
          if (line.startsWith('Abstract') || line.startsWith('Introduction')) {
            return <div key={i} className="font-bold">{line}</div>;
          }
          return <p key={i} className={i > 0 ? "mt-2" : ""}>{line}</p>;
        })}
      </div>
      
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