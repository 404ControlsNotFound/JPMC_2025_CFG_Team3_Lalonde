import React from "react";

import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import { NewHopeIcon } from "@/components/new-hope-icon";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        })),
      );

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: () => (
    <>
      <div className="flex h-[60px] items-center justify-start gap-4 bg-blue-800 p-2 text-white shadow-md">
        {/* Logo */}
        <div className="flex items-center">
          <NewHopeIcon size={60} />
          <div>
            <h1 className="text-lg font-bold text-blue-200">NEW HOPE</h1>
            <p className="-mt-1 text-xs text-white">COMMUNITY SERVICES</p>
          </div>
        </div>
      </div>
      <main className="h-[calc(100vh-60px)] w-screen bg-gray-900 text-white">
        <Outlet />
      </main>
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  ),
});
