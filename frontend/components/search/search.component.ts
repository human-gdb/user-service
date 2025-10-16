// Search Component - handles fairy tale search functionality
import { SearchService } from '../../services/search.service';
import { SearchResult, SearchStats } from '../../models/search.model';

export class SearchComponent {
  private searchService: SearchService;
  public searchQuery: string = '';
  public searchResults: SearchResult[] = [];
  public searchResponse: string | null = null;
  public isSearching: boolean = false;
  public searchStats: SearchStats | null = null;

  constructor() {
    this.searchService = new SearchService();
  }

  async searchFairyTales(): Promise<void> {
    if (!this.searchQuery.trim()) {
      this.searchResponse = 'Please enter a search query';
      return;
    }

    this.isSearching = true;
    this.searchResponse = null;

    try {
      const data = await this.searchService.searchFairyTales(this.searchQuery.trim(), 10, false);
      this.searchResults = data.results;
      this.searchResponse = `Found ${data.totalResults} results in ${data.searchTime}ms`;
    } catch (error: any) {
      this.searchResponse = 'Error: ' + error.message;
    } finally {
      this.isSearching = false;
    }
  }

  async fetchSearchStats(): Promise<void> {
    try {
      this.searchStats = await this.searchService.getSearchStats();
    } catch (error: any) {
      console.error('Error fetching search stats:', error);
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
    this.searchResponse = null;
  }

  highlightMatch(text: string, query: string): string {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
}
