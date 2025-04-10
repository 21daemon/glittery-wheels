
import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";

type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  content: string;
  role: MessageRole;
  createdAt: Date;
}

interface ChatContextType {
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: uuidv4(),
          content: "Hi there! I'm your Autox24 virtual assistant. How can I help you with your car detailing needs today?",
          role: "assistant",
          createdAt: new Date(),
        },
      ]);
    }
  }, []);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message to chat
    const userMessage: ChatMessage = {
      id: uuidv4(),
      content,
      role: "user",
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call the edge function to get AI response (using Gemini API now)
      const { data, error } = await supabase.functions.invoke("chat-ai", {
        body: { 
          message: content,
          history: messages.slice(-6).map(m => ({ role: m.role, content: m.content }))
        }
      });

      if (error) throw error;

      // Add AI response to chat
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        content: data.response || "I'm sorry, I couldn't process your request at the moment.",
        role: "assistant",
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        role: "assistant",
        createdAt: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([
      {
        id: uuidv4(),
        content: "Hi there! I'm your Autox24 virtual assistant. How can I help you with your car detailing needs today?",
        role: "assistant",
        createdAt: new Date(),
      },
    ]);
  };

  return (
    <ChatContext.Provider value={{ messages, isLoading, sendMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
