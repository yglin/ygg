import { sample } from 'lodash';

export class Link {
  static forge(): string {
    return sample(['http://localhost:4200/home']);
  }
}
