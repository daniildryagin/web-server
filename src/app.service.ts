import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log('User arrived!');
    return 'Hello World!';
  }
}
