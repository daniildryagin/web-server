import { Injectable } from '@nestjs/common';

@Injectable()
export class GoodsService {

  sayHi(): string {
    console.log('Welcome to the user');
    return 'hello';
  }
}
