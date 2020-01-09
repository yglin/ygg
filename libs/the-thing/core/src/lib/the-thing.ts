import {
  extend,
  isArray,
  sampleSize,
  sample,
  random,
  range,
  remove,
  keyBy,
  isEmpty,
  mapValues,
  uniq
} from 'lodash';
import { Tags } from '@ygg/tags/core';
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
  tags: Tags;

  /** Create time */
  createAt: number;

  /** Last modified time */
  modifyAt: number;

  /** TheThingCells, define its own properties, attributes */
  cells: { [name: string]: TheThingCell };

  /**
   * External relations, linked to other the-things.
   * Store mappings from relation name to ids of objects
   **/
  relations: { [name: string]: string[] };

  static forge(options: any = {}): TheThing {
    const thing = new TheThing();
    thing.name =
      options.name ||
      sample([
        'The Thing(1982)',
        'The Thing(2011)',
        '痔瘡',
        'Jim Carry',
        '兩津',
        '會心的一擊',
        '咕嚕咕嚕',
        '屁股毛',
        '肉雞',
        '便便'
      ]);
    thing.tags = !!options.tags ? new Tags(options.tags) : Tags.forge();

    if (options.cells) {
      thing.cells = options.cells;
    } else {
      thing.cells = keyBy(
        sampleSize(
          [
            '身高',
            '體重',
            '性別',
            '血型',
            '售價',
            '棲息地',
            '主食',
            '喜歡',
            '天敵',
            '討厭'
          ],
          random(3, 6)
        ).map(name => TheThingCell.forge({ name })),
        cell => cell.name
      );
    }

    if (!isEmpty(options.relations)) {
      thing.relations = options.relations;
    }

    return thing;
  }

  constructor() {
    this.collection = TheThing.collection;
    this.id = generateID();
    this.name = '';
    this.createAt = new Date().valueOf();
    this.modifyAt = this.createAt;
    this.tags = new Tags();
    this.cells = {};
    this.relations = {};
  }

  hasCell(cell: TheThingCell): boolean {
    return cell.name in this.cells;
  }

  addCell(cell: TheThingCell) {
    this.cells[cell.name] = cell;
  }

  deleteCell(cell: TheThingCell) {
    if (this.hasCell(cell)) {
      delete this.cells[cell.name];
    }
  }

  clearCells() {
    this.cells = {};
  }

  addRelations(relationName: string, objectThings: TheThing[] | string[]) {
    let ids: string[] = [];
    if (typeof objectThings[0] === 'string') {
      ids = objectThings as string[];
    } else {
      ids = (objectThings as TheThing[]).map(thing => thing.id);
    }
    this.relations[relationName] = uniq(
      (this.relations[relationName] || []).concat(ids)
    );
  }

  removeRelation(relationName, objectThing: TheThing) {
    if (this.relations && relationName in this.relations) {
      remove(
        this.relations[relationName],
        objectId => objectId === objectThing.id
      );
      if (isEmpty(this.relations[relationName])) {
        delete this.relations[relationName];
      }
    }
  }

  fromJSON(data: any): this {
    extend(this, data);
    if (data) {
      if (data.tags) {
        this.tags = Tags.fromJSON(data.tags);
      }
      if (!isEmpty(data.cells)) {
        this.cells = mapValues(data.cells, cellData =>
          new TheThingCell().fromJSON(cellData)
        );
      }
    }
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }
}
