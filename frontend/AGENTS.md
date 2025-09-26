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

## Development Priorities

### Phase 1: Core Dashboard (Week 1-2)
1. Set up routing structure with dashboard and chat tabs
2. Create tenant data visualization with filtering
3. Implement basic metrics display
4. Build tenant profile cards with key information

### Phase 2: AI Integration (Week 3)
1. Integrate with backend recommendation API
2. Build chat interface for AI interactions
3. Implement resource recommendation display
4. Add real-time data updates

### Phase 3: Forms & Data Collection (Week 4)
1. Create tenant intake forms
2. Implement form validation and submission
3. Build admin interface for form management
4. Add multilingual support

### Phase 4: Advanced Features (Week 5+)
1. Calendar heatmap implementation
2. Advanced analytics and reporting
3. Export capabilities
4. Mobile responsiveness optimization

## Mock Data Requirements

Create realistic mock data representing:
- 50-100 diverse tenant profiles
- Resource allocation history spanning 6-12 months
- Event attendance records
- Various welfare status indicators
- Different engagement patterns (active, moderate, inactive residents)

## Backend Integration Points

- **GET /api/tenants** - Fetch all tenant data with filtering
- **GET /api/tenants/:id** - Get detailed tenant profile
- **POST /api/recommendations** - Get AI recommendations for resource allocation
- **POST /api/chat** - AI chat interactions
- **POST /api/forms/intake** - Submit new tenant forms
- **GET /api/analytics** - Dashboard metrics and KPIs

## Success Metrics

1. **Staff Efficiency**: Reduce time spent on manual data entry and searching
2. **Equitable Distribution**: Ensure all residents are considered for resources
3. **Data Quality**: Improve completeness and accuracy of tenant profiles
4. **Engagement Tracking**: Better visibility into resident participation patterns
5. **Decision Support**: AI-powered insights for resource allocation decisions

## Getting Started

1. **Environment Setup**:
   ```bash
   cd frontend
   pnpm install
   pnpm dev
   ```

2. **Development Workflow**:
   - Use feature branches for new components
   - Follow TypeScript strict mode
   - Implement responsive design from the start
   - Write unit tests for critical components

3. **Design Guidelines**:
   - Prioritize accessibility and ease of use
   - Use consistent color coding for different data types
   - Ensure mobile-friendly interface for field staff
   - Implement clear visual hierarchy for data importance

## Future Enhancements

- **Mobile App**: Native mobile application for field data collection
- **Automated Alerts**: Proactive notifications for tenant welfare concerns
- **Integration**: Connect with external social services databases
- **Predictive Analytics**: Machine learning models for early intervention
- **Multilingual AI**: Chat support in multiple languages and dialects