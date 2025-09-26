// API service functions for interacting with the backend

const API_BASE_URL = "http://localhost:8000";

export interface Resident {
  id: number;
  name: string;
  room: string;
  age: number;
  welfare_status: "good" | "fair" | "critical";
  engagement: "high" | "medium" | "low";
  last_interaction: string;
  resources_received: number;
  events_attended: number;
  move_in_date?: string;
  demographics?: string;
}

export interface ResourceAllocation {
  id?: number;
  resident_id: number;
  type: string;
  date: string;
  description: string;
}

export interface CaseNote {
  id?: number;
  resident_id: number;
  date: string;
  note: string;
  staff: string;
}

export interface ChatMessage {
  message: string;
}

export interface ChatResponse {
  response: string;
  data: any[];
  suggestions: string[];
}

export interface DashboardStats {
  total_residents: number;
  welfare_distribution: {
    good: number;
    fair: number;
    critical: number;
  };
  engagement_distribution: {
    high: number;
    medium: number;
    low: number;
  };
  total_resources: number;
  total_events: number;
  active_cases: number;
}

// Resident API functions
export const residentsApi = {
  // Get all residents with optional filters
  async getResidents(params?: {
    offset?: number;
    limit?: number;
    search?: string;
    welfare_status?: string;
    engagement?: string;
  }): Promise<Resident[]> {
    const url = new URL(`${API_BASE_URL}/residents`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          url.searchParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Failed to fetch residents: ${response.statusText}`);
    }
    return response.json();
  },

  // Get a single resident by ID
  async getResident(id: number): Promise<Resident> {
    const response = await fetch(`${API_BASE_URL}/residents/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch resident: ${response.statusText}`);
    }
    return response.json();
  },

  // Create a new resident
  async createResident(resident: Omit<Resident, "id">): Promise<Resident> {
    const response = await fetch(`${API_BASE_URL}/residents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resident),
    });
    if (!response.ok) {
      throw new Error(`Failed to create resident: ${response.statusText}`);
    }
    return response.json();
  },

  // Update a resident
  async updateResident(
    id: number,
    resident: Partial<Resident>,
  ): Promise<Resident> {
    const response = await fetch(`${API_BASE_URL}/residents/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resident),
    });
    if (!response.ok) {
      throw new Error(`Failed to update resident: ${response.statusText}`);
    }
    return response.json();
  },

  // Delete a resident
  async deleteResident(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/residents/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Failed to delete resident: ${response.statusText}`);
    }
  },

  // Get resident's resource history
  async getResidentResources(
    residentId: number,
  ): Promise<ResourceAllocation[]> {
    const response = await fetch(
      `${API_BASE_URL}/residents/${residentId}/resources`,
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch resident resources: ${response.statusText}`,
      );
    }
    return response.json();
  },

  // Add resource allocation for a resident
  async addResourceAllocation(
    residentId: number,
    resource: Omit<ResourceAllocation, "id" | "resident_id">,
  ): Promise<ResourceAllocation> {
    const response = await fetch(
      `${API_BASE_URL}/residents/${residentId}/resources`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resource),
      },
    );
    if (!response.ok) {
      throw new Error(
        `Failed to add resource allocation: ${response.statusText}`,
      );
    }
    return response.json();
  },

  // Get resident's case notes
  async getResidentNotes(residentId: number): Promise<CaseNote[]> {
    const response = await fetch(
      `${API_BASE_URL}/residents/${residentId}/notes`,
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch resident notes: ${response.statusText}`);
    }
    return response.json();
  },

  // Add case note for a resident
  async addCaseNote(
    residentId: number,
    note: Omit<CaseNote, "id" | "resident_id">,
  ): Promise<CaseNote> {
    const response = await fetch(
      `${API_BASE_URL}/residents/${residentId}/notes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
      },
    );
    if (!response.ok) {
      throw new Error(`Failed to add case note: ${response.statusText}`);
    }
    return response.json();
  },

  // Get dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch(`${API_BASE_URL}/residents/stats/summary`);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch dashboard stats: ${response.statusText}`,
      );
    }
    return response.json();
  },
};

// Chat API functions
export const chatApi = {
  // Send a chat message and get AI response
  async sendMessage(message: string): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });
    if (!response.ok) {
      throw new Error(`Failed to send chat message: ${response.statusText}`);
    }
    return response.json();
  },
};

// Error handling helper
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Generic error handler for API calls
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};
