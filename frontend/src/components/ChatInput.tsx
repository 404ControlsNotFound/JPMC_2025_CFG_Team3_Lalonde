import React, { useEffect, useRef, useState } from "react";

import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  placeholder = "Ask a follow-up question or request clarification...",
}) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-700 p-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            className="placeholder-text-secondary max-h-[200px] min-h-[44px] w-full resize-none rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-gray-100 focus:border-blue-500 focus:outline-none disabled:opacity-50"
            rows={1}
          />
        </div>

        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="flex-shrink-0 rounded-lg bg-blue-600 p-3 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-600"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

      <div className="mt-2 text-center text-xs text-gray-400">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
};

export default ChatInput;
