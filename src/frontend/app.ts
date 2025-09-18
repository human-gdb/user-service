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

interface AppData {
  title: string;
  helloResponse: string | null;
  users: User[];
  userResponse: string | null;
  newUser: NewUser;
}

interface AppMethods {
  fetchHello(): Promise<void>;
  fetchUsers(): Promise<void>;
  addUser(): Promise<void>;
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
      }
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
    }
  } as AppMethods,
  mounted(this: AppData & AppMethods): void {
    // Load initial data
    this.fetchHello();
    this.fetchUsers();
  }
}).mount('#app');