export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  sourceDocuments?: SourceDocument[];
}

export interface SourceDocument {
  content: string;
  person_name: string;
  age: string;
  job_title: string;
  location: string;
  income_level: string;
  annual_income: string;
  data_type: string;
}

export interface ResourceAllocationRequest {
  resource_name: string;
  available_quantity: number;
  resource_description: string;
  eligibility_criteria: string;
  priority_weights: { [key: string]: number };
  additional_filters?: { [key: string]: any };
}

export interface QueryResponse {
  question: string;
  answer: string;
  source_documents: SourceDocument[];
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  currentRequest: ResourceAllocationRequest | null;
}
