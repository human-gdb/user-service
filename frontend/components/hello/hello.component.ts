// Hello Component - handles hello API functionality
import { HelloService } from '../../services/hello.service';
import { HelloResponse } from '../../models/hello.model';

export class HelloComponent {
  private helloService: HelloService;
  public helloResponse: string | null = null;

  constructor() {
    this.helloService = new HelloService();
  }

  async fetchHello(): Promise<void> {
    try {
      const data: HelloResponse = await this.helloService.getHello();
      this.helloResponse = JSON.stringify(data, null, 2);
    } catch (error: any) {
      this.helloResponse = 'Error: ' + error.message;
    }
  }
}
