import { FairyTale, SearchResult, SearchMatch, SearchRequest, SearchResponse } from '../types';

export class FairyTaleSearchService {
  private tales: FairyTale[] = [];
  private baseUrl = 'https://www.cs.cmu.edu/~spok/grimmtmp';
  private isInitialized = false;

  /**
   * Initialize the service by fetching the list of fairy tales
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('Initializing fairy tale search service...');
      
      // Fetch the main page to get the list of fairy tales
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch fairy tales: ${response.statusText}`);
      }
      
      const html = await response.text();
      this.tales = this.parseFairyTaleList(html);
      
      console.log(`Loaded ${this.tales.length} fairy tales`);
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing fairy tale service:', error);
      throw error;
    }
  }

  /**
   * Parse the HTML to extract fairy tale links and titles
   */
  private parseFairyTaleList(html: string): FairyTale[] {
    const tales: FairyTale[] = [];
    
    // Look for links to fairy tales (typically .txt files)
    const linkRegex = /<a\s+href="([^"]+\.txt)"[^>]*>([^<]+)<\/a>/gi;
    let match;
    
    while ((match = linkRegex.exec(html)) !== null) {
      const [, filename, title] = match;
      const id = filename.replace('.txt', '');
      
      tales.push({
        id,
        title: title.trim(),
        url: `${this.baseUrl}/${filename}`,
        content: '' // Will be loaded on demand
      });
    }
    
    return tales;
  }

  /**
   * Load the content of a specific fairy tale
   */
  private async loadTaleContent(tale: FairyTale): Promise<string> {
    if (tale.content) return tale.content;

    try {
      const response = await fetch(tale.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch tale content: ${response.statusText}`);
      }
      
      const content = await response.text();
      tale.content = content;
      return content;
    } catch (error) {
      console.error(`Error loading tale content for ${tale.title}:`, error);
      return '';
    }
  }

  /**
   * Search for a query across all fairy tales
   */
  async search(request: SearchRequest): Promise<SearchResponse> {
    const startTime = Date.now();
    
    if (!this.isInitialized) {
      await this.initialize();
    }

    const { query, limit = 10, caseSensitive = false } = request;
    const searchResults: SearchResult[] = [];
    
    // Process each tale
    for (const tale of this.tales) {
      const content = await this.loadTaleContent(tale);
      if (!content) continue;

      const matches = this.searchInContent(content, query, caseSensitive);
      if (matches.length > 0) {
        const relevanceScore = this.calculateRelevanceScore(matches, content.length);
        
        searchResults.push({
          tale: {
            ...tale,
            content: content.substring(0, 500) + '...' // Truncate for response
          },
          matches,
          relevanceScore
        });
      }
    }

    // Sort by relevance score (highest first)
    searchResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Apply limit
    const limitedResults = searchResults.slice(0, limit);

    const searchTime = Date.now() - startTime;

    return {
      results: limitedResults,
      totalResults: searchResults.length,
      query,
      searchTime
    };
  }

  /**
   * Search for a query within a specific content
   */
  private searchInContent(content: string, query: string, caseSensitive: boolean): SearchMatch[] {
    const matches: SearchMatch[] = [];
    const lines = content.split('\n');
    const searchQuery = caseSensitive ? query : query.toLowerCase();
    const searchContent = caseSensitive ? content : content.toLowerCase();

    lines.forEach((line, index) => {
      const searchLine = caseSensitive ? line : line.toLowerCase();
      
      if (searchLine.includes(searchQuery)) {
        // Find all occurrences in this line
        let startIndex = 0;
        while (true) {
          const foundIndex = searchLine.indexOf(searchQuery, startIndex);
          if (foundIndex === -1) break;

          // Extract context (50 characters before and after)
          const contextStart = Math.max(0, foundIndex - 50);
          const contextEnd = Math.min(line.length, foundIndex + searchQuery.length + 50);
          const context = line.substring(contextStart, contextEnd);

          matches.push({
            line: line.trim(),
            lineNumber: index + 1,
            context: context.trim()
          });

          startIndex = foundIndex + 1;
        }
      }
    });

    return matches;
  }

  /**
   * Calculate relevance score based on number of matches and content length
   */
  private calculateRelevanceScore(matches: SearchMatch[], contentLength: number): number {
    const matchCount = matches.length;
    const density = matchCount / (contentLength / 1000); // matches per 1000 characters
    return matchCount * 10 + density * 5; // Weighted score
  }

  /**
   * Get all available fairy tales
   */
  async getTales(): Promise<FairyTale[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    return this.tales.map(tale => ({
      ...tale,
      content: '' // Don't include content in list
    }));
  }

  /**
   * Get a specific fairy tale by ID
   */
  async getTaleById(id: string): Promise<FairyTale | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const tale = this.tales.find(t => t.id === id);
    if (!tale) return null;

    const content = await this.loadTaleContent(tale);
    return {
      ...tale,
      content
    };
  }
}

// Export a singleton instance
export const searchService = new FairyTaleSearchService();
