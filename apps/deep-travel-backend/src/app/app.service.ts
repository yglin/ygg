import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): string {
    return 'Welcome to deep-travel-backend!';
  }
}
