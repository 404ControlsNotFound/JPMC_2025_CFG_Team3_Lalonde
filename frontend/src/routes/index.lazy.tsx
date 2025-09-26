import { useState } from "react";

import { createLazyFileRoute } from "@tanstack/react-router";

import { AiChatTab } from "@/components/ai-chat-tab";
import { DashboardTab } from "@/components/dashboard-tab";
import { Header } from "@/components/header";

export const Route = createLazyFileRoute("/")({
  component: DashboardComponent,
});

function DashboardComponent() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="p-6">
        <div className="space-y-6">
          {activeTab === "dashboard" && <DashboardTab />}
          {activeTab === "ai-chat" && <AiChatTab />}
        </div>
      </main>
    </div>
  );
}
