# New Hope Community Services - Frontend Dashboard

## Project Overview

This frontend application is designed for **New Hope Community Services**, a social service organization that provides transitional housing and support services to residents. The dashboard empowers staff to efficiently manage tenant welfare, track resource allocation, and make data-driven decisions through AI-powered recommendations.

## Problem Statement

New Hope Community Services faces several challenges in their current operations:

- **Manual Resource Allocation**: Staff rely on subjective knowledge and personal interactions, potentially missing residents who don't actively engage
- **Limited Data Collection**: Currently using basic tools like Microsoft Forms and Excel, lacking comprehensive tenant profiling
- **Invisible Residents**: Busy residents who don't attend community events or interact frequently with staff are often overlooked
- **Inefficient Tracking**: No systematic way to track resource distribution, tenant engagement, or welfare metrics
- **Fairness Concerns**: Ensuring equitable resource distribution without proper tracking mechanisms

## Solution Architecture

### Frontend Dashboard Features

#### 1. **Main Dashboard Tab**
- **Tenant Overview**: Comprehensive list/grid view of all residents
- **Metrics Display**: Key welfare indicators for each tenant
  - Resource allocation history
  - Community engagement levels
  - Last interaction date
  - Welfare status indicators
- **Advanced Filtering System**:
  - Filter by demographics (age, gender, employment status)
  - Filter by engagement level (active, moderate, inactive)
  - Filter by resource allocation history
  - Filter by welfare needs and priorities
- **Visual Analytics**:
  - Calendar heatmap showing event attendance per resident
  - Resource distribution timeline
  - Engagement pattern visualization

#### 2. **AI Chat Tab**
- **Intelligent Assistant**: AI-powered chatbot for staff queries
- **Resource Recommendation Engine**: 
  - Input: Available resources and allocation criteria
  - Output: Ranked list of recommended residents
  - Context-aware suggestions based on tenant profiles
- **Data Insights**: Ask questions about tenant patterns, resource usage, and welfare trends

#### 3. **Tenant Request Forms Page** (Separate Route)
- **Digital Forms**: Replace paper-based data collection
- **Multi-language Support**: Accommodate diverse resident population
- **Structured Data Collection**:
  - Personal information and demographics
  - Health and medical conditions
  - Social and emotional needs assessment
  - Resource requirements and preferences
  - Consent management for data sharing

### Technical Implementation

#### Core Technologies
- **Frontend Framework**: React with TypeScript
- **Routing**: TanStack Router (already configured)
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query for server state
- **UI Components**: Custom components with consistent design system

#### Key Components to Build

1. **Layout Components**
   - `DashboardLayout.tsx` - Main layout with navigation tabs
   - `Sidebar.tsx` - Navigation and filtering controls
   - `Header.tsx` - User info and global actions

2. **Dashboard Components**
   - `TenantGrid.tsx` - Main tenant display grid/list
   - `TenantCard.tsx` - Individual tenant summary card
   - `MetricsPanel.tsx` - Key statistics and KPIs
   - `FilterPanel.tsx` - Advanced filtering controls
   - `CalendarHeatmap.tsx` - Event attendance visualization

3. **AI Chat Components**
   - `ChatInterface.tsx` - Main chat UI
   - `RecommendationPanel.tsx` - Display AI recommendations
   - `ResourceInputForm.tsx` - Input form for resource criteria

4. **Forms Components**
   - `TenantIntakeForm.tsx` - New resident onboarding
   - `NeedsAssessmentForm.tsx` - Welfare needs evaluation
   - `ResourceRequestForm.tsx` - Tenant resource requests

#### Data Models

```typescript
interface Tenant {
  id: string;
  personalInfo: {
    name: string;
    age: number;
    gender: string;
    room: string;
    moveInDate: Date;
  };
  welfare: {
    healthStatus: 'good' | 'fair' | 'poor' | 'critical';
    socialEngagement: 'high' | 'medium' | 'low';
    lastInteraction: Date;
    caseNotes: string[];
  };
  resources: {
    allocatedItems: ResourceAllocation[];
    totalValue: number;
    lastAllocation: Date;
  };
  events: {
    attendance: EventAttendance[];
    totalAttended: number;
    engagementScore: number;
  };
}

interface ResourceAllocation {
  id: string;
  type: 'food' | 'clothing' | 'medical' | 'furniture' | 'other';
  description: string;
  value: number;
  dateAllocated: Date;
  allocatedBy: string;
}
```

## Development Priorities - 12 Hour Hackathon

### Phase 1: Setup & Core Structure (Hours 1-2)
1. Set up routing structure with dashboard and chat tabs
2. Create basic layout components (Header, Sidebar, Main content area)
3. Set up mock data structure and sample tenant data
4. Configure Tailwind styling system

### Phase 2: Dashboard UI (Hours 3-6)
1. Build tenant grid/list view with mock data
2. Create tenant profile cards with key metrics
3. Implement basic filtering UI (no complex logic needed)
4. Add visual metrics dashboard with charts/stats
5. Create calendar heatmap component (can use mock attendance data)

### Phase 3: AI Chat Interface (Hours 7-9)
1. Build chat UI components
2. Mock AI responses for resource recommendations
3. Create resource input form for recommendation criteria
4. Display mock recommendation results in structured format

### Phase 4: Forms & Polish (Hours 10-12)
1. Create tenant request form page with basic validation
2. Polish UI/UX and responsive design
3. Add loading states and smooth transitions
4. Demo preparation and final testing

**Note**: All backend integration will be mocked with static data and simulated API responses for demonstration purposes.

## Mock Data Requirements - Hackathon Focus

Create focused mock data for demonstration:
- **20-30 diverse tenant profiles** with realistic Singapore names and demographics
- **3-6 months of resource allocation history** per tenant
- **Event attendance patterns** showing different engagement levels
- **Variety of welfare statuses** (good, fair, poor, critical)
- **Different tenant archetypes**:
  - Highly engaged senior (attends most events)
  - Working-age resident (limited availability)
  - New tenant (minimal history)
  - At-risk resident (requires attention)
  - Regular recipient (frequent resource allocation)

**Mock API Responses**:
- Simulated AI chat responses for common staff queries
- Pre-built recommendation lists for different resource types
- Sample form submission confirmations

## Mock Backend Integration - Hackathon Version

All API calls will be mocked with static responses:

- **Mock Tenant Data**: JSON files with sample tenant profiles
- **Mock AI Responses**: Pre-written chat responses and recommendation lists
- **Mock Form Submissions**: Success/validation messages without actual backend
- **Mock Analytics**: Static dashboard metrics and KPIs
- **Local Storage**: For demonstrating state persistence (filters, form drafts)

**Implementation**:
```typescript
// Use mock services instead of real API calls
const mockTenantService = {
  getTenants: () => Promise.resolve(mockTenantData),
  getRecommendations: (criteria) => Promise.resolve(mockRecommendations),
  submitForm: (data) => Promise.resolve({ success: true })
};
```

## Success Metrics

1. **Staff Efficiency**: Reduce time spent on manual data entry and searching
2. **Equitable Distribution**: Ensure all residents are considered for resources
3. **Data Quality**: Improve completeness and accuracy of tenant profiles
4. **Engagement Tracking**: Better visibility into resident participation patterns
5. **Decision Support**: AI-powered insights for resource allocation decisions

## Getting Started - Hackathon Mode

1. **Quick Environment Setup**:
   ```bash
   cd frontend
   pnpm install
   pnpm dev
   ```

2. **Rapid Development Workflow**:
   - Work directly on main branch for speed
   - Focus on UI components over complex logic
   - Use Tailwind for quick styling
   - Prioritize visual impact over perfect code structure

3. **Hackathon Design Guidelines**:
   - **Speed over perfection**: Get working UI quickly
   - **Visual impact**: Make it look professional and polished
   - **Demo-ready**: Focus on features that show well in presentation
   - **Responsive basics**: Ensure desktop and tablet views work
   - **Color coding**: Use consistent colors for status indicators
   - **Mock everything**: Don't get blocked by backend dependencies

4. **Key Demo Features to Highlight**:
   - Interactive tenant filtering and search
   - Visual resource allocation tracking
   - AI chat with realistic responses
   - Professional dashboard aesthetics
   - Smooth user experience transitions

## Future Enhancements

- **Mobile App**: Native mobile application for field data collection
- **Automated Alerts**: Proactive notifications for tenant welfare concerns
- **Integration**: Connect with external social services databases
- **Predictive Analytics**: Machine learning models for early intervention
- **Multilingual AI**: Chat support in multiple languages and dialects