import React, { useEffect, useRef, useState } from "react";

import { AlertCircle, MessageCircle } from "lucide-react";

import { ragApi } from "../services/resource-allocation-api";
import {
  ChatState,
  Message,
  ResourceAllocationRequest,
} from "../types/resource-allocation";

import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import ResourceAllocationForm from "./ResourceAllocationForm";

const ChatInterface: React.FC = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    currentRequest: null,
  });
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

  const addMessage = (
    content: string,
    role: "user" | "assistant",
    sourceDocuments?: any[],
  ) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      role,
      timestamp: new Date(),
      sourceDocuments,
    };

    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));

    return newMessage;
  };

  const handleResourceAllocationSubmit = async (
    request: ResourceAllocationRequest,
  ) => {
    setError(null);
    setChatState((prev) => ({
      ...prev,
      isLoading: true,
      currentRequest: request,
    }));

    // Add user message showing the request
    const requestSummary = `Generate recommendations for:\n• Resource: ${request.resource_name}\n• Quantity: ${request.available_quantity}\n• Eligibility: ${request.eligibility_criteria}`;
    addMessage(requestSummary, "user");

    try {
      const response = await ragApi.queryResourceAllocation(request);
      addMessage(response.answer, "assistant", response.source_documents);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail ||
        err.message ||
        "Failed to get recommendations";
      setError(errorMessage);
      addMessage(`Error: ${errorMessage}`, "assistant");
    } finally {
      setChatState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleFollowUpMessage = async (message: string) => {
    setError(null);
    setChatState((prev) => ({ ...prev, isLoading: true }));

    addMessage(message, "user");

    try {
      const response = await ragApi.query(message);
      addMessage(response.answer, "assistant", response.source_documents);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail || err.message || "Failed to get response";
      setError(errorMessage);
      addMessage(`Error: ${errorMessage}`, "assistant");
    } finally {
      setChatState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const clearChat = () => {
    setChatState({
      messages: [],
      isLoading: false,
      currentRequest: null,
    });
    setError(null);
  };

  return (
    <div className="flex h-full bg-gray-800 text-gray-100">
      {/* Sidebar - Resource Allocation Form */}
      <ResourceAllocationForm
        onSubmit={handleResourceAllocationSubmit}
        isLoading={chatState.isLoading}
      />

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-6 w-6 text-blue-400" />
            <h1 className="text-xl font-semibold">
              Resource Allocation Assistant
            </h1>
          </div>

          {chatState.messages.length > 0 && (
            <button
              onClick={clearChat}
              className="rounded border border-gray-700 px-3 py-1 text-sm text-gray-400 transition-colors hover:border-gray-500 hover:text-gray-100"
            >
              Clear Chat
            </button>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {chatState.messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <MessageCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h2 className="mb-2 text-xl text-gray-100">
                  Welcome to Resource Allocation
                </h2>
                <p className="max-w-md text-gray-400">
                  Fill out the form on the left to generate resource allocation
                  recommendations. Then ask follow-up questions to refine and
                  understand the recommendations.
                </p>
              </div>
            </div>
          ) : (
            <div className="pb-4">
              {chatState.messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}

              {chatState.isLoading && (
                <div className="flex gap-4 bg-gray-800/50 p-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-white"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-400">
                      Analyzing profiles and generating recommendations...
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-4 mb-4 flex items-center gap-2 rounded-lg border border-red-500/50 bg-red-900/30 p-3">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <span className="text-sm text-red-200">{error}</span>
          </div>
        )}

        {/* Chat Input */}
        {chatState.messages.length > 0 && (
          <ChatInput
            onSendMessage={handleFollowUpMessage}
            isLoading={chatState.isLoading}
            placeholder={
              chatState.currentRequest
                ? "Ask questions about the recommendations, request clarifications, or explore alternatives..."
                : "Ask a follow-up question..."
            }
          />
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
