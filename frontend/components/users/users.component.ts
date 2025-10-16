// Users Component - handles user management functionality
import { UserService } from '../../services/user.service';
import { User, NewUser } from '../../models/user.model';

export class UsersComponent {
  private userService: UserService;
  public users: User[] = [];
  public userResponse: string | null = null;
  public newUser: NewUser = {
    name: '',
    email: ''
  };

  constructor() {
    this.userService = new UserService();
  }

  async fetchUsers(): Promise<void> {
    try {
      this.users = await this.userService.getUsers();
      this.userResponse = null;
    } catch (error: any) {
      this.userResponse = 'Error: ' + error.message;
    }
  }

  async addUser(): Promise<void> {
    if (!this.newUser.name || !this.newUser.email) {
      this.userResponse = 'Please fill in both name and email';
      return;
    }
    
    try {
      const newUser: User = await this.userService.addUser(this.newUser);
      this.userResponse = 'User created successfully: ' + JSON.stringify(newUser, null, 2);
      this.newUser.name = '';
      this.newUser.email = '';
      // Refresh the users list
      this.fetchUsers();
    } catch (error: any) {
      this.userResponse = 'Error: ' + error.message;
    }
  }
}
