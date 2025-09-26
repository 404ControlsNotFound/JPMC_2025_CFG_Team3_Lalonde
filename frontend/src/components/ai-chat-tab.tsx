import React, { useState } from "react";

import { Minus, Plus, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  extractPersonName,
  formatResponseText,
  useInteractiveResponse,
} from "@/hooks/useInteractiveResponse";
import { ragApi } from "@/services/resource-allocation-api";
import {
  ResourceAllocationRequest,
  SourceDocument as APISourceDocument,
} from "@/types/resource-allocation";

interface ResidentData {
  name?: string;
  room?: string;
  welfare_status?: string;
  status?: string;
}

interface ChatEntry {
  type: "user" | "ai";
  message: string;
  data?: ResidentData[];
  suggestions?: string[];
  sourceDocuments?: APISourceDocument[];
}

export function AiChatTab() {
  const [activeMode, setActiveMode] = useState<"general" | "resource">(
    "general",
  );
  const [chatMessage, setChatMessage] = useState("");
  const [generalChatHistory, setGeneralChatHistory] = useState<ChatEntry[]>([]);
  const [resourceChatHistory, setResourceChatHistory] = useState<ChatEntry[]>(
    [],
  );
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Interactive response hook for better UI rendering
  const { renderResponse, setSelectedPerson } = useInteractiveResponse();

  // Handle clicking on a person card to generate refined questions
  const handlePersonClick = (document: APISourceDocument) => {
    setSelectedPerson(document);
    // Extract the real person name from content if person_name is "Unknown"
    const personName = document.person_name && document.person_name !== "Unknown" 
      ? document.person_name 
      : extractPersonName(document.content || "");
    
    // Generate a refined question based on the person's profile
    const refinedQuestion = `Tell me more about ${personName} (${document.job_title || "Unknown role"} in ${document.location || "Unknown location"}) and their specific needs for resource allocation.`;
    setChatMessage(refinedQuestion);
  };

  // Get current chat history setter based on active mode
  const setCurrentChatHistory =
    activeMode === "general" ? setGeneralChatHistory : setResourceChatHistory;

  // Resource allocation form state
  const [formData, setFormData] = useState<ResourceAllocationRequest>({
    resource_name: "",
    available_quantity: 1,
    resource_description: "",
    eligibility_criteria: "",
    priority_weights: {
      recent_recipients: 0.3,
      need_level: 0.7,
    },
    additional_filters: {},
  });

  const [newWeightKey, setNewWeightKey] = useState("");
  const [newWeightValue, setNewWeightValue] = useState(0);
  const [newFilterKey, setNewFilterKey] = useState("");
  const [newFilterValue, setNewFilterValue] = useState("");

  // Chat functionality
  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;

    const userMessage = chatMessage.trim();
    setIsChatLoading(true);

    // Add user message to current history
    setCurrentChatHistory((prev) => [
      ...prev,
      { type: "user", message: userMessage },
    ]);
    setChatMessage("");

    try {
      // Use ragApi.query for general chat as well
      const response = await ragApi.query(userMessage);

      // Add AI response to current history
      setCurrentChatHistory((prev) => [
        ...prev,
        {
          type: "ai",
          message: response.answer,
          sourceDocuments: response.source_documents || [],
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setCurrentChatHistory((prev) => [
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

  // Separate handler for resource allocation follow-up questions
  const handleResourceFollowUp = async () => {
    if (!chatMessage.trim()) return;

    const userMessage = chatMessage.trim();
    setIsChatLoading(true);

    // Add user message to resource chat history
    setResourceChatHistory((prev) => [
      ...prev,
      { type: "user", message: userMessage },
    ]);
    setChatMessage("");

    try {
      // Use ragApi for resource allocation follow-ups to maintain context
      const response = await ragApi.query(userMessage);
      setResourceChatHistory((prev) => [
        ...prev,
        {
          type: "ai",
          message: response.answer,
          sourceDocuments: response.source_documents,
        },
      ]);
    } catch (error) {
      console.error("Resource follow-up error:", error);
      setResourceChatHistory((prev) => [
        ...prev,
        {
          type: "ai",
          message:
            "Sorry, I encountered an error processing your follow-up question. Please try again.",
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Resource allocation form handling
  const handleInputChange = (
    field: keyof ResourceAllocationRequest,
    value: unknown,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleWeightChange = (key: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      priority_weights: { ...prev.priority_weights, [key]: value },
    }));
  };

  const addWeight = () => {
    if (newWeightKey && newWeightValue >= 0 && newWeightValue <= 1) {
      handleWeightChange(newWeightKey, newWeightValue);
      setNewWeightKey("");
      setNewWeightValue(0);
    }
  };

  const removeWeight = (key: string) => {
    const weights = { ...formData.priority_weights };
    delete weights[key];
    setFormData((prev) => ({ ...prev, priority_weights: weights }));
  };

  const addFilter = () => {
    if (newFilterKey && newFilterValue) {
      setFormData((prev) => ({
        ...prev,
        additional_filters: {
          ...prev.additional_filters,
          [newFilterKey]: newFilterValue,
        },
      }));
      setNewFilterKey("");
      setNewFilterValue("");
    }
  };

  const removeFilter = (key: string) => {
    const filters = { ...formData.additional_filters };
    delete filters[key];
    setFormData((prev) => ({ ...prev, additional_filters: filters }));
  };

  // Resource allocation functionality - now generates refined questions instead of direct submission
  const handleResourceAllocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Generate a refined question based on the form data
    const refinedQuestion = `I need to allocate ${formData.available_quantity} units of "${formData.resource_name}" to eligible residents. The resource is: ${formData.resource_description}. Eligibility criteria: ${formData.eligibility_criteria}. Please analyze resident profiles and recommend the most suitable candidates based on their needs and circumstances.`;

    // Set the refined question in the chat input instead of sending directly
    setChatMessage(refinedQuestion);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>AI-Powered Resource Assistant</CardTitle>
              <CardDescription>
                Ask questions about residents and get AI-powered recommendations
              </CardDescription>
            </div>

            {/* Mode Toggle */}
            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  activeMode === "general"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-blue-600"
                }`}
                onClick={() => setActiveMode("general")}
              >
                General Chat
              </button>
              <button
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  activeMode === "resource"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-blue-600"
                }`}
                onClick={() => setActiveMode("resource")}
              >
                Resource Allocation
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeMode === "resource" ? (
            <div className="flex gap-6">
              {/* Resource Allocation Form */}
              <div className="w-80 flex-shrink-0 rounded-lg border bg-white">
                <div className="border-b p-4">
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">
                      Resource Allocation
                    </h3>
                  </div>
                </div>

                <ScrollArea className="h-96">
                  <div className="p-4">
                    <form
                      onSubmit={handleResourceAllocationSubmit}
                      className="space-y-4"
                    >
                      {/* Basic Information */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-700">
                          Basic Information
                        </h4>

                        <div>
                          <label className="mb-1 block text-xs text-gray-600">
                            Resource Name
                          </label>
                          <Input
                            type="text"
                            value={formData.resource_name}
                            onChange={(e) =>
                              handleInputChange("resource_name", e.target.value)
                            }
                            placeholder="e.g., Emergency Food Assistance"
                            required
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs text-gray-600">
                            Available Quantity
                          </label>
                          <Input
                            type="number"
                            min="1"
                            value={formData.available_quantity}
                            onChange={(e) =>
                              handleInputChange(
                                "available_quantity",
                                parseInt(e.target.value),
                              )
                            }
                            required
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs text-gray-600">
                            Description
                          </label>
                          <textarea
                            value={formData.resource_description}
                            onChange={(e) =>
                              handleInputChange(
                                "resource_description",
                                e.target.value,
                              )
                            }
                            className="h-20 w-full resize-none rounded border border-gray-300 px-3 py-2 text-sm"
                            placeholder="Describe what this resource provides..."
                            required
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs text-gray-600">
                            Eligibility Criteria
                          </label>
                          <textarea
                            value={formData.eligibility_criteria}
                            onChange={(e) =>
                              handleInputChange(
                                "eligibility_criteria",
                                e.target.value,
                              )
                            }
                            className="h-20 w-full resize-none rounded border border-gray-300 px-3 py-2 text-sm"
                            placeholder="Who is eligible for this resource?"
                            required
                          />
                        </div>
                      </div>

                      {/* Priority Weights */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-700">
                          Priority Weights
                        </h4>

                        {Object.entries(formData.priority_weights).map(
                          ([key, value]) => (
                            <div key={key} className="flex items-center gap-2">
                              <div className="flex-1">
                                <label className="mb-1 block text-xs text-gray-600">
                                  {key
                                    .replace("_", " ")
                                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                                </label>
                                <input
                                  type="range"
                                  min="0"
                                  max="1"
                                  step="0.1"
                                  value={value}
                                  onChange={(e) =>
                                    handleWeightChange(
                                      key,
                                      parseFloat(e.target.value),
                                    )
                                  }
                                  className="w-full"
                                />
                                <div className="mt-1 text-xs text-gray-500">
                                  {(value * 100).toFixed(0)}%
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeWeight(key)}
                                className="p-1 text-red-500 hover:text-red-400"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                            </div>
                          ),
                        )}

                        <div className="flex gap-2">
                          <Input
                            type="text"
                            value={newWeightKey}
                            onChange={(e) => setNewWeightKey(e.target.value)}
                            placeholder="Weight name"
                            className="flex-1 text-xs"
                          />
                          <Input
                            type="number"
                            min="0"
                            max="1"
                            step="0.1"
                            value={newWeightValue}
                            onChange={(e) =>
                              setNewWeightValue(parseFloat(e.target.value))
                            }
                            className="w-16 text-xs"
                          />
                          <button
                            type="button"
                            onClick={addWeight}
                            className="p-1 text-green-500 hover:text-green-400"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Additional Filters */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-700">
                          Additional Filters
                        </h4>

                        {Object.entries(formData.additional_filters || {}).map(
                          ([key, value]) => (
                            <div key={key} className="flex items-center gap-2">
                              <div className="flex-1">
                                <div className="text-xs text-gray-600">
                                  {key}: {String(value)}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFilter(key)}
                                className="p-1 text-red-500 hover:text-red-400"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                            </div>
                          ),
                        )}

                        <div className="flex gap-2">
                          <Input
                            type="text"
                            value={newFilterKey}
                            onChange={(e) => setNewFilterKey(e.target.value)}
                            placeholder="Filter name"
                            className="flex-1 text-xs"
                          />
                          <Input
                            type="text"
                            value={newFilterValue}
                            onChange={(e) => setNewFilterValue(e.target.value)}
                            placeholder="Filter value"
                            className="flex-1 text-xs"
                          />
                          <button
                            type="button"
                            onClick={addFilter}
                            className="p-1 text-green-500 hover:text-green-400"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={
                          !formData.resource_name ||
                          !formData.resource_description
                        }
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        Generate Refined Question
                      </Button>
                    </form>
                  </div>
                </ScrollArea>
              </div>

              {/* Chat Area for Resource Allocation */}
              <div className="flex-1">
                <div className="h-96 overflow-y-auto rounded-lg border bg-gray-50 p-4">
                  {resourceChatHistory.length === 0 ? (
                    <div className="rounded-lg bg-blue-50 p-4">
                      <p className="text-sm text-blue-800">
                        🎯 Resource Allocation Mode: Fill out the form on the
                        left to generate resource allocation recommendations.
                        You can then ask follow-up questions about the
                        recommendations.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {resourceChatHistory.map((entry, index) => (
                        <div
                          key={index}
                          className={`rounded-lg p-3 ${
                            entry.type === "user"
                              ? "ml-12 bg-blue-600 text-white"
                              : "mr-12 border bg-white"
                          }`}
                        >
                          {entry.type === "ai" ? (
                            <div className="text-sm">
                              {formatResponseText(entry.message)}
                            </div>
                          ) : (
                            <p className="text-sm">{entry.message}</p>
                          )}

                          {/* Interactive source documents for resource allocation */}
                          {entry.type === "ai" &&
                            entry.sourceDocuments &&
                            entry.sourceDocuments.length > 0 &&
                            renderResponse(
                              entry.sourceDocuments,
                              handlePersonClick,
                            )}
                        </div>
                      ))}

                      {isChatLoading && (
                        <div className="mr-12 rounded-lg border bg-white p-3">
                          <p className="text-sm text-gray-500">
                            AI is analyzing profiles...
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Follow-up input for resource allocation */}
                <div className="mt-4 flex space-x-2">
                  <Input
                    placeholder="Ask follow-up questions about the recommendations..."
                    className="flex-1"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleResourceFollowUp()
                    }
                    disabled={isChatLoading}
                  />
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleResourceFollowUp}
                    disabled={!chatMessage.trim() || isChatLoading}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Regular Chat History */}
              <div className="h-96 overflow-y-auto rounded-lg border bg-gray-50 p-4">
                {generalChatHistory.length === 0 ? (
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
                    {generalChatHistory.map((entry, index) => (
                      <div
                        key={index}
                        className={`rounded-lg p-3 ${
                          entry.type === "user"
                            ? "ml-12 bg-blue-600 text-white"
                            : "mr-12 border bg-white"
                        }`}
                      >
                        {entry.type === "ai" ? (
                          <div className="text-sm">
                            {formatResponseText(entry.message)}
                          </div>
                        ) : (
                          <p className="text-sm">{entry.message}</p>
                        )}

                        {/* Interactive source documents for general chat */}
                        {entry.type === "ai" &&
                          entry.sourceDocuments &&
                          entry.sourceDocuments.length > 0 &&
                          renderResponse(
                            entry.sourceDocuments,
                            handlePersonClick,
                          )}
                      </div>
                    ))}

                    {isChatLoading && (
                      <div className="mr-12 rounded-lg border bg-white p-3">
                        <p className="text-sm text-gray-500">
                          AI is thinking...
                        </p>
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
                      handleQuickQuestion(
                        "give me the immediate people in help",
                      )
                    }
                  >
                    Who needs immediate help?
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto justify-start p-3 text-left"
                    onClick={() =>
                      handleQuickQuestion(
                        "show me people with health conditions",
                      )
                    }
                  >
                    People with health conditions
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto justify-start p-3 text-left"
                    onClick={() =>
                      handleQuickQuestion(
                        "find residents facing family conflicts",
                      )
                    }
                  >
                    Family conflicts and mediation
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto justify-start p-3 text-left"
                    onClick={() =>
                      handleQuickQuestion(
                        "analyze income levels and financial needs",
                      )
                    }
                  >
                    Financial assistance analysis
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
