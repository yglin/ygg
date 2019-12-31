import { extend, isArray } from 'lodash';
import { TheThingCell } from './cell';
import { generateID, toJSONDeep } from '@ygg/shared/infra/data-access';

export class TheThing {
  static collection = 'the-things';

  id: string;

  /** Category, group, table, or collection name */
  collection: string;

  /** Display name */
  name: string;

  //** Type tags for query and search */
  types: string[];

  /** Create time */
  createAt: number;

  /** Last modified time */
  modifyAt: number;

  cells: TheThingCell[];

  static from(meta: any, cells: TheThingCell[] = []): TheThing {
    const theThing = new TheThing();
    theThing.name = meta.name;
    theThing.types = meta.types;
    theThing.cells = cells;
    return theThing;
  }

  static forge(): TheThing {
    const thing = new TheThing();
    thing.name = 'The Thing 1982';
    return thing;
  }

  constructor() {
    this.collection = TheThing.collection;
    this.id = generateID();
    this.createAt = new Date().valueOf();
    this.modifyAt = this.createAt;
    this.types = [];
    this.cells = [];
  }

  fromJSON(data: any): this {
    extend(this, data);
    if (data && isArray(data.cells)) {
      this.cells = data.cells.map(cellData =>
        new TheThingCell().fromJSON(cellData)
      );
    }
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }
}
