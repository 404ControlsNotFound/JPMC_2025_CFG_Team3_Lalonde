import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { chatApi } from "@/services/api";

interface ChatEntry {
  type: "user" | "ai";
  message: string;
  data?: any[];
  suggestions?: string[];
}

export function AiChatTab() {
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Chat functionality
  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;

    const userMessage = chatMessage.trim();
    setIsChatLoading(true);

    // Add user message to history
    setChatHistory((prev) => [...prev, { type: "user", message: userMessage }]);
    setChatMessage("");

    try {
      const response = await chatApi.sendMessage(userMessage);

      // Add AI response to history
      setChatHistory((prev) => [
        ...prev,
        {
          type: "ai",
          message: response.response,
          data: response.data || [],
          suggestions: response.suggestions || [],
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          type: "ai",
          message:
            "Sorry, I encountered an error processing your request. Please try again.",
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleQuickQuestion = async (question: string) => {
    setChatMessage(question);
    // Wait for the message to be set, then send it
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Resource Assistant</CardTitle>
          <CardDescription>
            Ask questions about residents and get AI-powered recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Chat History */}
            <div className="h-96 overflow-y-auto rounded-lg border bg-gray-50 p-4">
              {chatHistory.length === 0 ? (
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-blue-800">
                    💬 Hello! I'm your AI assistant for resident welfare
                    management. You can ask me questions like "Who needs food
                    assistance?" or "Show me residents with low engagement
                    levels."
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatHistory.map((entry, index) => (
                    <div
                      key={index}
                      className={`rounded-lg p-3 ${
                        entry.type === "user"
                          ? "ml-12 bg-blue-600 text-white"
                          : "mr-12 border bg-white"
                      }`}
                    >
                      <p className="text-sm">{entry.message}</p>

                      {/* Display data if AI response has data */}
                      {entry.type === "ai" &&
                        entry.data &&
                        entry.data.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {entry.data.slice(0, 3).map((item, i) => (
                              <div
                                key={i}
                                className="rounded border bg-gray-50 p-2 text-xs"
                              >
                                <p className="font-medium">
                                  {item.name || "N/A"}
                                </p>
                                <p className="text-gray-600">
                                  Room: {item.room || "N/A"} | Status:{" "}
                                  {item.welfare_status || item.status || "N/A"}
                                </p>
                              </div>
                            ))}
                            {entry.data.length > 3 && (
                              <p className="text-xs text-gray-500">
                                ...and {entry.data.length - 3} more
                              </p>
                            )}
                          </div>
                        )}

                      {/* Display suggestions */}
                      {entry.type === "ai" &&
                        entry.suggestions &&
                        entry.suggestions.length > 0 && (
                          <div className="mt-3">
                            <p className="mb-1 text-xs font-medium text-gray-700">
                              Suggestions:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {entry.suggestions
                                .slice(0, 3)
                                .map((suggestion, i) => (
                                  <span
                                    key={i}
                                    className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800"
                                  >
                                    {suggestion}
                                  </span>
                                ))}
                            </div>
                          </div>
                        )}
                    </div>
                  ))}

                  {isChatLoading && (
                    <div className="mr-12 rounded-lg border bg-white p-3">
                      <p className="text-sm text-gray-500">AI is thinking...</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Questions */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Quick Questions</h4>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <Button
                  variant="outline"
                  className="h-auto justify-start p-3 text-left"
                  onClick={() =>
                    handleQuickQuestion("Who needs immediate attention?")
                  }
                >
                  Who needs immediate attention?
                </Button>
                <Button
                  variant="outline"
                  className="h-auto justify-start p-3 text-left"
                  onClick={() =>
                    handleQuickQuestion("Show me inactive residents")
                  }
                >
                  Show inactive residents
                </Button>
                <Button
                  variant="outline"
                  className="h-auto justify-start p-3 text-left"
                  onClick={() =>
                    handleQuickQuestion(
                      "Which residents should receive furniture?",
                    )
                  }
                >
                  Which residents should receive furniture?
                </Button>
                <Button
                  variant="outline"
                  className="h-auto justify-start p-3 text-left"
                  onClick={() =>
                    handleQuickQuestion("Analyze engagement patterns")
                  }
                >
                  Analyze engagement patterns
                </Button>
              </div>
            </div>

            {/* Chat Input */}
            <div className="flex space-x-2">
              <Input
                placeholder="Ask about residents, resources, or get recommendations..."
                className="flex-1"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isChatLoading}
              />
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleSendMessage}
                disabled={!chatMessage.trim() || isChatLoading}
              >
                Send
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
