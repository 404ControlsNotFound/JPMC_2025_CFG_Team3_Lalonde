# Resource Allocation Chat Frontend

A React TypeScript frontend that provides a ChatGPT-like interface for resource allocation with AI-powered recommendations.

## Features

- **ChatGPT-like UI**: Clean, modern interface similar to ChatGPT
- **Resource Allocation Form**: Sidebar form for configuring allocation parameters
- **Real-time Chat**: Interactive chat for follow-up questions and clarifications
- **Source Citations**: View detailed profile information for recommended individuals
- **Responsive Design**: Works on desktop and tablet devices

## Setup

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file in the frontend directory:
   ```
   REACT_APP_API_BASE_URL=http://localhost:8000
   ```

3. **Start Development Server**:
   ```bash
   npm start
   ```

   The application will open at `http://localhost:3000`

## Usage

### 1. Resource Allocation Form (Sidebar)

Fill out the form with:
- **Resource Name**: Name of the resource to allocate
- **Available Quantity**: Number of units available
- **Description**: What the resource provides
- **Eligibility Criteria**: Who qualifies for this resource
- **Priority Weights**: Importance of different factors (sliders)
- **Additional Filters**: Optional extra criteria

### 2. AI Recommendations

Click "Generate Recommendations" to get AI-powered allocation suggestions based on the available profile data.

### 3. Follow-up Questions

After receiving recommendations, ask natural language questions like:
- "Why was John Smith recommended over Jane Doe?"
- "Show me alternatives if John Smith declines"
- "What are the income levels of the recommended individuals?"
- "Can you explain the reasoning behind the priority ranking?"

## Components

- **ChatInterface**: Main application component
- **ResourceAllocationForm**: Sidebar form for input parameters
- **MessageBubble**: Individual chat message display
- **ChatInput**: Text input for follow-up questions

## API Integration

The frontend communicates with the FastAPI backend using axios:
- Resource allocation queries: `POST /rag/query-resource-allocation`
- Follow-up questions: `POST /rag/query`
- Health checks: `GET /rag/health`

## Styling

Uses Tailwind CSS with custom ChatGPT-inspired color scheme:
- Dark theme optimized for readability
- Custom scrollbars and form elements
- Responsive design principles