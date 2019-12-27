import { TheThingCell } from './cell';

export class TheThing {
  /** Display name */
  name: string;

  /** Create time */
  createAt: number;

  /** Last modified time */
  modifyAt: number;

  [key: string]: any;

  static forge(): TheThing {
    const thing = new TheThing();
    thing.name = 'The Thing 1982';
    return thing;
  }

  constructor() {
    this.createAt = new Date().valueOf();
    this.modifyAt = this.createAt;
  }
}