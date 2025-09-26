import { createLazyFileRoute } from "@tanstack/react-router";

import { TechCard } from "@/components/tech-cards";

import {
  ReactIcon,
  TailwindIcon,
  TanStackIcon,
  TypeScriptIcon,
  ViteIcon,
} from "../components/tech-icons";

export const Route = createLazyFileRoute("/")({
  component: WelcomeComponent,
});

function WelcomeComponent() {
  return (
    <div className="flex h-screen w-screen flex-col bg-gray-900 text-white md:flex-row">
      <div className="flex w-full flex-col justify-center p-16 md:w-1/2">
        <h1 className="mb-8 text-5xl font-extrabold text-blue-400">
          Welcome to Your New React Template!
        </h1>
        <p className="mb-8 text-lg leading-relaxed text-gray-300">
          Get started by exploring the file structure and modifying the
          components. This template provides a solid foundation for building
          modern React applications. Enjoy the power of TanStack Router and
          TanStack Query for client side applications.
        </p>
      </div>
    </div>
  );
}
