import { sample } from 'lodash';

export class Link {
  static forge(): string {
    return sample(['https://playwhat-dev.ygg.tw/home']);
  }
}
