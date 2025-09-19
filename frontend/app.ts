// Vue.js application
declare const Vue: any;

interface User {
  id: number;
  name: string;
  email: string;
}

interface NewUser {
  name: string;
  email: string;
}

interface HelloResponse {
  message: string;
  timestamp: string;
}

interface ErrorResponse {
  error: string;
}

// Search API types
interface FairyTale {
  id: string;
  title: string;
  url: string;
  content: string;
}

interface SearchMatch {
  line: string;
  lineNumber: number;
  context: string;
}

interface SearchResult {
  tale: FairyTale;
  matches: SearchMatch[];
  relevanceScore: number;
}

interface SearchResponse {
  results: SearchResult[];
  totalResults: number;
  query: string;
  searchTime: number;
}

interface AppData {
  title: string;
  helloResponse: string | null;
  users: User[];
  userResponse: string | null;
  newUser: NewUser;
  // Search properties
  searchQuery: string;
  searchResults: SearchResult[];
  searchResponse: string | null;
  isSearching: boolean;
  searchStats: {
    totalTales: number;
    isInitialized: boolean;
    baseUrl: string;
  } | null;
}

interface AppMethods {
  fetchHello(): Promise<void>;
  fetchUsers(): Promise<void>;
  addUser(): Promise<void>;
  // Search methods
  searchFairyTales(): Promise<void>;
  fetchSearchStats(): Promise<void>;
  clearSearch(): void;
}

const { createApp } = Vue;

createApp({
  data(): AppData {
    return {
      title: 'Vue.js + Express.js Application',
      helloResponse: null,
      users: [],
      userResponse: null,
      newUser: {
        name: '',
        email: ''
      },
      // Search properties
      searchQuery: '',
      searchResults: [],
      searchResponse: null,
      isSearching: false,
      searchStats: null
    };
  },
  methods: {
    async fetchHello(this: AppData & AppMethods): Promise<void> {
      try {
        const response = await fetch('/api/hello');
        const data: HelloResponse = await response.json();
        this.helloResponse = JSON.stringify(data, null, 2);
      } catch (error: any) {
        this.helloResponse = 'Error: ' + error.message;
      }
    },
    async fetchUsers(this: AppData & AppMethods): Promise<void> {
      try {
        const response = await fetch('/api/users');
        const data: User[] = await response.json();
        this.users = data;
        this.userResponse = null;
      } catch (error: any) {
        this.userResponse = 'Error: ' + error.message;
      }
    },
    async addUser(this: AppData & AppMethods): Promise<void> {
      if (!this.newUser.name || !this.newUser.email) {
        this.userResponse = 'Please fill in both name and email';
        return;
      }
      
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.newUser)
        });
        
        if (response.ok) {
          const newUser: User = await response.json();
          this.userResponse = 'User created successfully: ' + JSON.stringify(newUser, null, 2);
          this.newUser.name = '';
          this.newUser.email = '';
          // Refresh the users list
          this.fetchUsers();
        } else {
          const error: ErrorResponse = await response.json();
          this.userResponse = 'Error: ' + error.error;
        }
      } catch (error: any) {
        this.userResponse = 'Error: ' + error.message;
      }
    },
    // Search methods
    async searchFairyTales(this: AppData & AppMethods): Promise<void> {
      if (!this.searchQuery.trim()) {
        this.searchResponse = 'Please enter a search query';
        return;
      }

      this.isSearching = true;
      this.searchResponse = null;

      try {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: this.searchQuery.trim(),
            limit: 10,
            caseSensitive: false
          })
        });

        if (response.ok) {
          const data: SearchResponse = await response.json();
          this.searchResults = data.results;
          this.searchResponse = `Found ${data.totalResults} results in ${data.searchTime}ms`;
        } else {
          const error: ErrorResponse = await response.json();
          this.searchResponse = 'Error: ' + error.error;
        }
      } catch (error: any) {
        this.searchResponse = 'Error: ' + error.message;
      } finally {
        this.isSearching = false;
      }
    },
    async fetchSearchStats(this: AppData & AppMethods): Promise<void> {
      try {
        const response = await fetch('/api/search/stats');
        if (response.ok) {
          this.searchStats = await response.json();
        }
      } catch (error: any) {
        console.error('Error fetching search stats:', error);
      }
    },
    clearSearch(this: AppData & AppMethods): void {
      this.searchQuery = '';
      this.searchResults = [];
      this.searchResponse = null;
    },
    highlightMatch(text: string, query: string): string {
      if (!query) return text;
      const regex = new RegExp(`(${query})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    }
  } as AppMethods,
  mounted(this: AppData & AppMethods): void {
    // Load initial data
    this.fetchHello();
    this.fetchUsers();
    this.fetchSearchStats();
  }
}).mount('#app');