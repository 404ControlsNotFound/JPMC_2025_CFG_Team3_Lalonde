# Resource Allocation Frontend

A modern React TypeScript application featuring both a dashboard interface and a resource allocation chat system.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm package manager

### Installation & Setup

1. **Install Dependencies**:
   ```bash
   cd frontend
   pnpm install
   ```

2. **Environment Configuration**:
   Copy the environment file and configure API endpoint:
   ```bash
   cp .env.example .env
   # Edit .env to set VITE_API_BASE_URL if needed (defaults to http://localhost:8000)
   ```

3. **Start Development Server**:
   ```bash
   pnpm dev
   ```

   Application will be available at `http://localhost:5173`

## 🎯 Features

### Main Dashboard
- Modern UI with shadcn/ui components
- TanStack Router for navigation
- React Query for state management

### Resource Allocation Chat
- ChatGPT-style interface at `/resource-allocation`
- Sidebar form for resource allocation parameters
- Interactive chat for follow-up questions
- Real-time AI-powered recommendations

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── ChatInterface.tsx    # Main chat interface
│   ├── ResourceAllocationForm.tsx  # Resource form
│   └── MessageBubble.tsx    # Chat messages
├── routes/              # TanStack Router routes
├── services/            # API services
├── types/               # TypeScript definitions
└── styles/              # Global styles
```

## 🛠 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm test` - Run tests

## 🔧 Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **TailwindCSS v4** for styling
- **TanStack Router** for routing
- **TanStack Query** for state management
- **Radix UI** for accessible components
- **shadcn/ui** for component library
- **Axios** for API calls

## 🎨 UI Libraries

- [shadcn/ui](https://ui.shadcn.com/) - Modern component library
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
- [Lucide React](https://lucide.dev/) - Beautiful icons

