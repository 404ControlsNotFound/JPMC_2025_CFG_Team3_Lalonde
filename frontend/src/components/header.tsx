import { Users } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white px-6 py-3 shadow-sm">
      <div className="flex items-center justify-center">
        {/* Navigation Tabs */}
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            className={`flex items-center space-x-2 rounded-md px-6 py-2 text-sm font-medium transition-colors ${
              activeTab === "dashboard"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => onTabChange("dashboard")}
          >
            <Users className="h-4 w-4" />
            <span>Dashboard</span>
          </button>
          <button
            className={`flex items-center space-x-2 rounded-md px-6 py-2 text-sm font-medium transition-colors ${
              activeTab === "ai-chat"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => onTabChange("ai-chat")}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3.04.97 4.43L1 23l6.57-1.97C9.96 21.64 11.46 22 13 22h7c1.1 0 2-.9 2-2V12c0-5.52-4.48-10-10-10z" />
            </svg>
            <span>AI Assistant</span>
          </button>
        </div>
      </div>
    </header>
  );
}
