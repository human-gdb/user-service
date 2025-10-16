// Vue.js application with Angular-like structure - Bundled version
declare const Vue: any;
declare const Vuetify: any;

// Models
interface User {
  id: number;
  name: string;
  email: string;
}

interface NewUser {
  name: string;
  email: string;
}

interface SearchResult {
  tale: {
    id: string;
    title: string;
    url: string;
    content: string;
  };
  matches: {
    line: string;
    lineNumber: number;
    context: string;
  }[];
  relevanceScore: number;
}

interface SearchStats {
  totalTales: number;
  isInitialized: boolean;
  baseUrl: string;
}

interface HelloResponse {
  message: string;
  timestamp: string;
}

interface ErrorResponse {
  error: string;
}

// Services
class HelloService {
  private baseUrl = '/api';

  async getHello(): Promise<HelloResponse> {
    const response = await fetch(`${this.baseUrl}/hello`);
    if (!response.ok) {
      throw new Error(`Failed to fetch hello message: ${response.statusText}`);
    }
    return response.json();
  }
}

class UserService {
  private baseUrl = '/api';

  async getUsers(): Promise<User[]> {
    const response = await fetch(`${this.baseUrl}/users`);
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }
    return response.json();
  }

  async addUser(user: NewUser): Promise<User> {
    const response = await fetch(`${this.baseUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user)
    });

    if (!response.ok) {
      const error: ErrorResponse = await response.json();
      throw new Error(error.error);
    }

    return response.json();
  }
}

class SearchService {
  private baseUrl = '/api';

  async searchFairyTales(query: string, limit: number = 10, caseSensitive: boolean = false): Promise<{results: SearchResult[], totalResults: number, query: string, searchTime: number}> {
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

// Initialize services
const helloService = new HelloService();
const userService = new UserService();
const searchService = new SearchService();

// Vue App
const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      title: 'Vue.js + Express.js Application',
      // Navigation state
      drawer: true,
      currentView: 'hello',
      navigationItems: [
        { title: 'Hello API', icon: 'mdi-hand-wave', value: 'hello' },
        { title: 'Users API', icon: 'mdi-account-group', value: 'users' },
        { title: 'Fairy Tale Search', icon: 'mdi-magnify', value: 'search' },
        { title: 'API Docs', icon: 'mdi-book-open-variant', value: 'docs' }
      ],
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
    // Navigation methods
    selectView(view) {
      this.currentView = view;
    },
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    // Hello API methods
    async fetchHello() {
      try {
        const data = await helloService.getHello();
        this.helloResponse = JSON.stringify(data, null, 2);
      } catch (error) {
        this.helloResponse = 'Error: ' + error.message;
      }
    },
    
    // User API methods
    async fetchUsers() {
      try {
        this.users = await userService.getUsers();
        this.userResponse = null;
      } catch (error) {
        this.userResponse = 'Error: ' + error.message;
      }
    },
    async addUser() {
      if (!this.newUser.name || !this.newUser.email) {
        this.userResponse = 'Please fill in both name and email';
        return;
      }
      
      try {
        const newUser = await userService.addUser(this.newUser);
        this.userResponse = 'User created successfully: ' + JSON.stringify(newUser, null, 2);
        this.newUser.name = '';
        this.newUser.email = '';
        // Refresh the users list
        this.fetchUsers();
      } catch (error) {
        this.userResponse = 'Error: ' + error.message;
      }
    },
    
    // Search API methods
    async searchFairyTales() {
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
      } catch (error) {
        this.searchResponse = 'Error: ' + error.message;
      } finally {
        this.isSearching = false;
      }
    },
    async fetchSearchStats() {
      try {
        this.searchStats = await searchService.getSearchStats();
      } catch (error) {
        console.error('Error fetching search stats:', error);
      }
    },
    clearSearch() {
      this.searchQuery = '';
      this.searchResults = [];
      this.searchResponse = null;
    },
    highlightMatch(text, query) {
      if (!query) return text;
      const regex = new RegExp(`(${query})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    }
  },
    mounted() {
        // Load initial data
        this.fetchHello();
        this.fetchUsers();
        this.fetchSearchStats();
    }
});

// Use Vuetify
app.use(Vuetify.createVuetify({
    theme: {
        defaultTheme: 'light'
    }
}));

app.mount('#app');
