"use client";

import { useState } from "react";

import {
  Bot,
  Lightbulb,
  MessageSquare,
  Send,
  Sparkles,
  User,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface ResourceRecommendation {
  residentId: number;
  residentName: string;
  room: string;
  score: number;
  reasons: string[];
  urgency: "low" | "medium" | "high";
  lastAllocation: string;
}

const mockMessages: Message[] = [
  {
    id: "1",
    type: "assistant",
    content:
      "Hello! I'm your AI assistant for New Hope Community Services. I can help you with resident insights, resource allocation recommendations, and answer questions about your community. How can I assist you today?",
    timestamp: new Date(Date.now() - 300000),
    suggestions: [
      "Who needs food assistance?",
      "Show me inactive residents",
      "Recommend furniture recipients",
      "Identify at-risk residents",
    ],
  },
];

const mockRecommendations: ResourceRecommendation[] = [
  {
    residentId: 3,
    residentName: "Ahmad Rahman",
    room: "C-308",
    score: 95,
    reasons: [
      "Critical welfare status",
      "Low recent allocation",
      "High resource need history",
    ],
    urgency: "high",
    lastAllocation: "2024-01-05",
  },
  {
    residentId: 6,
    residentName: "Raj Patel",
    room: "C-201",
    score: 88,
    reasons: [
      "Poor welfare status",
      "Chronic health issues",
      "Active participation in programs",
    ],
    urgency: "high",
    lastAllocation: "2024-01-06",
  },
  {
    residentId: 2,
    residentName: "Tan Siew Lan",
    room: "B-205",
    score: 75,
    reasons: [
      "Fair welfare status",
      "Senior citizen priority",
      "Regular program attendance",
    ],
    urgency: "medium",
    lastAllocation: "2024-01-10",
  },
  {
    residentId: 5,
    residentName: "Chen Mei Ling",
    room: "B-107",
    score: 68,
    reasons: [
      "Recovery support needed",
      "Medium engagement level",
      "Consistent resource usage",
    ],
    urgency: "medium",
    lastAllocation: "2024-01-09",
  },
];

const examplePrompts = [
  {
    category: "Resident Insights",
    prompts: [
      "Who are the most at-risk residents?",
      "Show me residents with low engagement",
      "Which residents haven't been contacted recently?",
      "Find residents with critical welfare status",
    ],
  },
  {
    category: "Resource Management",
    prompts: [
      "Who needs food assistance this week?",
      "Recommend recipients for clothing donations",
      "Which residents need medical support?",
      "Show furniture allocation priorities",
    ],
  },
  {
    category: "Program Analysis",
    prompts: [
      "Analyze attendance patterns",
      "Show engagement trends",
      "Identify program gaps",
      "Recommend intervention strategies",
    ],
  },
];

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case "high":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "medium":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "low":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

export default function AIAssistantTab() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedResource, setSelectedResource] = useState("Food");
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>([
    "High need",
    "Low recent allocation",
  ]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: generateAIResponse(inputValue),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();

    if (
      lowerInput.includes("food") ||
      lowerInput.includes("hungry") ||
      lowerInput.includes("meal")
    ) {
      return "Based on current data, I recommend prioritizing food assistance for Ahmad Rahman (C-308) and Raj Patel (C-201) who have critical/poor welfare status and haven't received food support recently. Tan Siew Lan (B-205) also has special dietary requirements that should be considered. Would you like me to generate a detailed food distribution plan?";
    }

    if (
      lowerInput.includes("at-risk") ||
      lowerInput.includes("critical") ||
      lowerInput.includes("urgent")
    ) {
      return "I've identified 3 high-priority at-risk residents: Ahmad Rahman (C-308) with critical welfare status and low engagement, Raj Patel (C-201) struggling with chronic health issues, and any residents who haven't been contacted in over 7 days. I recommend immediate welfare checks and intervention planning for these cases.";
    }

    if (
      lowerInput.includes("inactive") ||
      lowerInput.includes("engagement") ||
      lowerInput.includes("participation")
    ) {
      return "Currently, 23% of residents show low engagement levels. Key concerns include Ahmad Rahman and Raj Patel who have missed multiple appointments. I suggest implementing targeted outreach programs and personalized engagement strategies. Would you like specific intervention recommendations for each resident?";
    }

    if (
      lowerInput.includes("furniture") ||
      lowerInput.includes("housing") ||
      lowerInput.includes("accommodation")
    ) {
      return "For furniture allocation, I recommend prioritizing Chen Mei Ling (B-107) who recently needed bed frame replacement, and any new residents who moved in within the last 30 days. Consider ergonomic furniture for elderly residents and those with mobility issues.";
    }

    return "I understand you're looking for insights about resident care. Based on current data, I can help you identify priority cases, resource allocation needs, and engagement patterns. Could you be more specific about what type of analysis or recommendations you need?";
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleCriteriaChange = (criteria: string, checked: boolean) => {
    if (checked) {
      setSelectedCriteria((prev) => [...prev, criteria]);
    } else {
      setSelectedCriteria((prev) => prev.filter((c) => c !== criteria));
    }
  };

  const generateRecommendations = () => {
    setShowRecommendations(true);
  };

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="mb-6 text-center">
        <h2 className="mb-2 text-2xl font-bold text-balance">AI Assistant</h2>
        <p className="text-muted-foreground text-pretty">
          Get intelligent insights and recommendations for resident care and
          resource allocation
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="bg-card/50 border-border flex h-[600px] flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Chat Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col p-0">
              {/* Messages */}
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-4 pb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.type === "user" ? "justify-end" : ""}`}
                    >
                      {message.type === "assistant" && (
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className="bg-primary/20 text-primary">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.type === "user"
                            ? "bg-primary text-primary-foreground ml-auto"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">
                          {message.content}
                        </p>
                        <p className="mt-2 text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {message.type === "user" && (
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className="bg-secondary text-secondary-foreground">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}

                  {/* Suggestions */}
                  {messages.length === 1 && (
                    <div className="flex flex-wrap gap-2 px-3">
                      {messages[0].suggestions?.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="bg-background/50 text-xs"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}

                  {isLoading && (
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="bg-primary/20 text-primary">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted text-muted-foreground rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 animate-bounce rounded-full bg-current" />
                            <div
                              className="h-2 w-2 animate-bounce rounded-full bg-current"
                              style={{ animationDelay: "0.1s" }}
                            />
                            <div
                              className="h-2 w-2 animate-bounce rounded-full bg-current"
                              style={{ animationDelay: "0.2s" }}
                            />
                          </div>
                          <span className="text-xs">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="border-border border-t p-4">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about residents, resources, or get recommendations..."
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="bg-background/50"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resource Recommendation Panel */}
        <div className="space-y-6">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Resource Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Resource Type
                  </label>
                  <Select
                    value={selectedResource}
                    onValueChange={setSelectedResource}
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Clothing">Clothing</SelectItem>
                      <SelectItem value="Medical">Medical</SelectItem>
                      <SelectItem value="Furniture">Furniture</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Selection Criteria
                  </label>
                  <div className="space-y-2">
                    {[
                      "High need",
                      "Low recent allocation",
                      "Active participation",
                      "Senior priority",
                      "Health priority",
                    ].map((criteria) => (
                      <div
                        key={criteria}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={criteria}
                          checked={selectedCriteria.includes(criteria)}
                          onCheckedChange={(checked) =>
                            handleCriteriaChange(criteria, checked as boolean)
                          }
                        />
                        <label htmlFor={criteria} className="text-sm">
                          {criteria}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={generateRecommendations} className="w-full">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Recommendations
                </Button>
              </div>

              {showRecommendations && (
                <div className="border-border space-y-3 border-t pt-4">
                  <h4 className="text-sm font-medium">
                    Recommended Recipients
                  </h4>
                  {mockRecommendations.slice(0, 3).map((rec) => (
                    <Card
                      key={rec.residentId}
                      className="bg-background/30 border-border"
                    >
                      <CardContent className="p-3">
                        <div className="mb-2 flex items-start justify-between">
                          <div>
                            <h5 className="text-sm font-medium">
                              {rec.residentName}
                            </h5>
                            <p className="text-muted-foreground text-xs">
                              {rec.room}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold">
                              {rec.score}%
                            </div>
                            <Badge
                              className={`text-xs ${getUrgencyColor(rec.urgency)}`}
                            >
                              {rec.urgency}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-1">
                          {rec.reasons.slice(0, 2).map((reason, index) => (
                            <p
                              key={index}
                              className="text-muted-foreground text-xs"
                            >
                              • {reason}
                            </p>
                          ))}
                        </div>
                        <p className="text-muted-foreground mt-2 text-xs">
                          Last: {rec.lastAllocation}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Example Prompts */}
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="text-base">Example Prompts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {examplePrompts.map((category) => (
                <div key={category.category}>
                  <h4 className="text-muted-foreground mb-2 text-sm font-medium">
                    {category.category}
                  </h4>
                  <div className="space-y-1">
                    {category.prompts.map((prompt, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="bg-background/30 hover:bg-background/50 h-auto w-full justify-start p-2 text-left text-xs"
                        onClick={() => handleSuggestionClick(prompt)}
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
