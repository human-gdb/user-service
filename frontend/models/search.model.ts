// Search-related models
export interface FairyTale {
  id: string;
  title: string;
  url: string;
  content: string;
}

export interface SearchMatch {
  line: string;
  lineNumber: number;
  context: string;
}

export interface SearchResult {
  tale: FairyTale;
  matches: SearchMatch[];
  relevanceScore: number;
}

export interface SearchResponse {
  results: SearchResult[];
  totalResults: number;
  query: string;
  searchTime: number;
}

export interface SearchStats {
  totalTales: number;
  isInitialized: boolean;
  baseUrl: string;
}
