import React from "react";

import { Bot, ChevronDown, ChevronUp, User } from "lucide-react";

import { Message } from "../types/resource-allocation";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [showSources, setShowSources] = React.useState(false);
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-4 p-4 ${isUser ? "bg-transparent" : "bg-gray-800/50"}`}
    >
      <div className="flex-shrink-0">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            isUser ? "bg-blue-600" : "bg-green-600"
          }`}
        >
          {isUser ? (
            <User className="h-5 w-5 text-white" />
          ) : (
            <Bot className="h-5 w-5 text-white" />
          )}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="leading-7 break-words whitespace-pre-wrap text-gray-100">
          {message.content}
        </div>

        {message.sourceDocuments && message.sourceDocuments.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setShowSources(!showSources)}
              className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-gray-100"
            >
              {showSources ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              {message.sourceDocuments.length} source
              {message.sourceDocuments.length !== 1 ? "s" : ""}
            </button>

            {showSources && (
              <div className="mt-3 space-y-3">
                {message.sourceDocuments.map((doc, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-600 bg-gray-800 p-3"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div className="text-sm font-medium text-gray-100">
                        {doc.person_name || "Unknown Person"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {doc.data_type}
                      </div>
                    </div>

                    <div className="mb-3 grid grid-cols-2 gap-2 text-xs text-gray-400">
                      <div>Age: {doc.age || "N/A"}</div>
                      <div>Location: {doc.location || "N/A"}</div>
                      <div>Job: {doc.job_title || "N/A"}</div>
                      <div>Income: {doc.income_level || "N/A"}</div>
                    </div>

                    <div className="rounded bg-gray-900 p-2 text-sm text-gray-400">
                      {doc.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-3 text-xs text-gray-400">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
