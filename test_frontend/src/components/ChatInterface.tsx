import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, AlertCircle } from 'lucide-react';
import { Message, ResourceAllocationRequest, ChatState } from '../types';
import { ragApi } from '../services/api';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import ResourceAllocationForm from './ResourceAllocationForm';

const ChatInterface: React.FC = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    currentRequest: null,
  });
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

  const addMessage = (content: string, role: 'user' | 'assistant', sourceDocuments?: any[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      role,
      timestamp: new Date(),
      sourceDocuments,
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));

    return newMessage;
  };

  const handleResourceAllocationSubmit = async (request: ResourceAllocationRequest) => {
    setError(null);
    setChatState(prev => ({ ...prev, isLoading: true, currentRequest: request }));

    // Add user message showing the request
    const requestSummary = `Generate recommendations for:\n• Resource: ${request.resource_name}\n• Quantity: ${request.available_quantity}\n• Eligibility: ${request.eligibility_criteria}`;
    addMessage(requestSummary, 'user');

    try {
      const response = await ragApi.queryResourceAllocation(request);
      addMessage(response.answer, 'assistant', response.source_documents);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to get recommendations';
      setError(errorMessage);
      addMessage(`Error: ${errorMessage}`, 'assistant');
    } finally {
      setChatState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleFollowUpMessage = async (message: string) => {
    setError(null);
    setChatState(prev => ({ ...prev, isLoading: true }));

    addMessage(message, 'user');

    try {
      const response = await ragApi.query(message);
      addMessage(response.answer, 'assistant', response.source_documents);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to get response';
      setError(errorMessage);
      addMessage(`Error: ${errorMessage}`, 'assistant');
    } finally {
      setChatState(prev => ({ ...prev, isLoading: false }));
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
    <div className="flex h-screen bg-chat-bg text-text-primary">
      {/* Sidebar - Resource Allocation Form */}
      <ResourceAllocationForm
        onSubmit={handleResourceAllocationSubmit}
        isLoading={chatState.isLoading}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border-gray p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-blue-400" />
            <h1 className="text-xl font-semibold">Resource Allocation Assistant</h1>
          </div>

          {chatState.messages.length > 0 && (
            <button
              onClick={clearChat}
              className="text-text-secondary hover:text-text-primary text-sm px-3 py-1 rounded border border-border-gray hover:border-gray-500 transition-colors"
            >
              Clear Chat
            </button>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {chatState.messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                <h2 className="text-xl text-text-primary mb-2">Welcome to Resource Allocation</h2>
                <p className="text-text-secondary max-w-md">
                  Fill out the form on the left to generate resource allocation recommendations.
                  Then ask follow-up questions to refine and understand the recommendations.
                </p>
              </div>
            </div>
          ) : (
            <div className="pb-4">
              {chatState.messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}

              {chatState.isLoading && (
                <div className="flex gap-4 p-4 bg-gray-800/50">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-text-secondary">Analyzing profiles and generating recommendations...</div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-4 mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-red-200 text-sm">{error}</span>
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