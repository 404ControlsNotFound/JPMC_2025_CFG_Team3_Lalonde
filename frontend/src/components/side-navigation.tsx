import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X, Home, UserPlus, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const navigationItems: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
    description: "Main dashboard with overview and AI assistant",
  },
  {
    name: "Tenant Registration",
    href: "/tenant_form",
    icon: UserPlus,
    description: "Register new tenants and manage profiles",
  },
  {
    name: "Item Request",
    href: "/request_form",
    icon: FileText,
    description: "Submit requests for items and resources",
  },
];

export function SideNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-blue-700 hover:text-white"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation menu</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] p-0">
        <DialogHeader className="bg-blue-800 text-white p-6">
          <DialogTitle className="flex items-center justify-between">
            Navigation Menu
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-700 hover:text-white h-auto p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <nav className="space-y-3">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-start space-x-3 rounded-lg p-3 transition-colors hover:bg-gray-50 ${
                    isActive ? "bg-blue-50 border border-blue-200" : ""
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon
                    className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                      isActive ? "text-blue-600" : "text-gray-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-sm font-medium ${
                        isActive ? "text-blue-600" : "text-gray-900"
                      }`}
                    >
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </DialogContent>
    </Dialog>
  );
}