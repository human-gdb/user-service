// Vue.js application with Angular-like structure
declare const Vue: any;

// Import services
import { HelloService } from './services/hello.service';
import { UserService } from './services/user.service';
import { SearchService } from './services/search.service';

// Import models
import { User, NewUser } from './models/user.model';
import { SearchResult, SearchStats } from './models/search.model';
import { HelloResponse } from './models/hello.model';

interface AppData {
  title: string;
  // Reactive data properties
  helloResponse: string | null;
  users: User[];
  userResponse: string | null;
  newUser: NewUser;
  searchQuery: string;
  searchResults: SearchResult[];
  searchResponse: string | null;
  isSearching: boolean;
  searchStats: SearchStats | null;
}

interface AppMethods {
  fetchHello(): Promise<void>;
  fetchUsers(): Promise<void>;
  addUser(): Promise<void>;
  searchFairyTales(): Promise<void>;
  fetchSearchStats(): Promise<void>;
  clearSearch(): void;
  highlightMatch(text: string, query: string): string;
}

const { createApp } = Vue;

// Initialize services
const helloService = new HelloService();
const userService = new UserService();
const searchService = new SearchService();

createApp({
  data(): AppData {
    return {
      title: 'Vue.js + Express.js Application',
      // Initialize reactive data
      helloResponse: null,
      users: [],
      userResponse: null,
      newUser: {
        name: '',
        email: ''
      },
      searchQuery: '',
      searchResults: [],
      searchResponse: null,
      isSearching: false,
      searchStats: null
    };
  },
  methods: {
    // Hello API methods
    async fetchHello(this: AppData & AppMethods): Promise<void> {
      try {
        const data: HelloResponse = await helloService.getHello();
        this.helloResponse = JSON.stringify(data, null, 2);
      } catch (error: any) {
        this.helloResponse = 'Error: ' + error.message;
      }
    },
    
    // User API methods
    async fetchUsers(this: AppData & AppMethods): Promise<void> {
      try {
        this.users = await userService.getUsers();
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
        const newUser: User = await userService.addUser(this.newUser);
        this.userResponse = 'User created successfully: ' + JSON.stringify(newUser, null, 2);
        this.newUser.name = '';
        this.newUser.email = '';
        // Refresh the users list
        this.fetchUsers();
      } catch (error: any) {
        this.userResponse = 'Error: ' + error.message;
      }
    },
    
    // Search API methods
    async searchFairyTales(this: AppData & AppMethods): Promise<void> {
      if (!this.searchQuery.trim()) {
        this.searchResponse = 'Please enter a search query';
        return;
      }

      this.isSearching = true;
      this.searchResponse = null;

      try {
        const data = await searchService.searchFairyTales(this.searchQuery.trim(), 10, false);
        this.searchResults = data.results;
        this.searchResponse = `Found ${data.totalResults} results in ${data.searchTime}ms`;
      } catch (error: any) {
        this.searchResponse = 'Error: ' + error.message;
      } finally {
        this.isSearching = false;
      }
    },
    async fetchSearchStats(this: AppData & AppMethods): Promise<void> {
      try {
        this.searchStats = await searchService.getSearchStats();
      } catch (error: any) {
        console.error('Error fetching search stats:', error);
      }
    },
    clearSearch(this: AppData & AppMethods): void {
      this.searchQuery = '';
      this.searchResults = [];
      this.searchResponse = null;
    },
    highlightMatch(this: AppData & AppMethods, text: string, query: string): string {
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