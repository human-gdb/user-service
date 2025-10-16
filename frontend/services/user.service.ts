// User Service - handles all user-related API calls
import { User, NewUser } from '../models/user.model';
import { ErrorResponse } from '../models/common.model';

export class UserService {
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
