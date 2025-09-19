export interface User {
  id: number;
  name: string;
  email: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
}

export interface ErrorResponse {
  error: string;
}

// Search API types
export interface FairyTale {
  id: string;
  title: string;
  url: string;
  content: string;
}

export interface SearchResult {
  tale: FairyTale;
  matches: SearchMatch[];
  relevanceScore: number;
}

export interface SearchMatch {
  line: string;
  lineNumber: number;
  context: string;
}

export interface SearchRequest {
  query: string;
  limit?: number;
  caseSensitive?: boolean;
}

export interface SearchResponse {
  results: SearchResult[];
  totalResults: number;
  query: string;
  searchTime: number;
}