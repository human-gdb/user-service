// Search Service - handles all search-related API calls
import { FairyTale, SearchMatch, SearchResult, SearchResponse, SearchStats } from '../models/search.model';
import { ErrorResponse } from '../models/common.model';

export class SearchService {
  private baseUrl = '/api';

  async searchFairyTales(query: string, limit: number = 10, caseSensitive: boolean = false): Promise<SearchResponse> {
    const response = await fetch(`${this.baseUrl}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query.trim(),
        limit,
        caseSensitive
      })
    });

    if (!response.ok) {
      const error: ErrorResponse = await response.json();
      throw new Error(error.error);
    }

    return response.json();
  }

  async getSearchStats(): Promise<SearchStats> {
    const response = await fetch(`${this.baseUrl}/search/stats`);
    if (!response.ok) {
      throw new Error(`Failed to fetch search stats: ${response.statusText}`);
    }
    return response.json();
  }
}
