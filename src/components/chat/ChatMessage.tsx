
import React from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import type { ChatMessage as ChatMessageType } from "@/contexts/ChatContext";

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full items-start gap-2 py-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
          <span className="text-xs">AX</span>
        </Avatar>
      )}
      
      <div
        className={cn(
          "rounded-lg px-4 py-2 max-w-[80%]",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8 bg-secondary">
          <span className="text-xs">You</span>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
