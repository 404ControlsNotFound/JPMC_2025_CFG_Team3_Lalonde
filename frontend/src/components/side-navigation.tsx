import { useState, useEffect } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X, Home, UserPlus, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";

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

  // Close navigation when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const nav = document.getElementById('slide-navigation');
      const button = document.getElementById('nav-button');
      if (
        isOpen &&
        nav &&
        button &&
        !nav.contains(event.target as Node) &&
        !button.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      {/* Menu Button */}
      <Button
        id="nav-button"
        variant="ghost"
        size="sm"
        className="text-white hover:bg-blue-700 hover:text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Slide-in Navigation Panel */}
      <div
        id="slide-navigation"
        className={`fixed top-0 left-0 h-full w-80 max-w-[90vw] sm:w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-blue-800 text-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Navigation Menu</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-700 hover:text-white h-auto p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-6 overflow-y-auto h-full">
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
      </div>
    </>
  );
}