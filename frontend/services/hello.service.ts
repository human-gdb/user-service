// Hello Service - handles hello API calls
import { HelloResponse } from '../models/hello.model';

export class HelloService {
  private baseUrl = '/api';

  async getHello(): Promise<HelloResponse> {
    const response = await fetch(`${this.baseUrl}/hello`);
    if (!response.ok) {
      throw new Error(`Failed to fetch hello message: ${response.statusText}`);
    }
    return response.json();
  }
}
