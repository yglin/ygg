import {
  extend,
  isArray,
  sampleSize,
  sample,
  random,
  range,
  keyBy,
  isEmpty,
  mapValues,
  uniq
} from 'lodash';
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

  /** TheThingCells, define its own properties, attributes */
  cells: { [name: string]: TheThingCell };

  /**
   * External relations, linked to other the-things.
   * Store mappings from relation name to ids of objects
   **/
  relations: { [name: string]: string[] };

  static from(meta: any, cells: TheThingCell[] = []): TheThing {
    const theThing = new TheThing();
    theThing.name = meta.name;
    theThing.types = meta.types;
    theThing.cells = keyBy(cells, cell => cell.name);
    return theThing;
  }

  static forge(options: any = {}): TheThing {
    const thing = new TheThing();
    thing.name = sample([
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
    thing.types = sampleSize(
      [
        'play',
        'lesson',
        'travel',
        'food',
        'movie',
        'game',
        'sport',
        'gift',
        'groceries',
        '鳥鳥',
        '犬犬',
        '喵喵',
        '畜牲',
        '早上5點就該該叫',
        '可以配飯吃',
        '高雄迪士尼',
        '鏟屎官',
        '打飯奴'
      ],
      3
    );

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
    return thing;
  }

  constructor() {
    this.collection = TheThing.collection;
    this.id = generateID();
    this.createAt = new Date().valueOf();
    this.modifyAt = this.createAt;
    this.types = [];
    this.cells = {};
    this.relations = {};
  }

  addRelations(relationName: string, objectThings: TheThing[]) {
    this.relations[relationName] = uniq(
      (this.relations[relationName] || []).concat(
        objectThings.map(thing => thing.id)
      )
    );
  }

  fromJSON(data: any): this {
    extend(this, data);
    if (data && !isEmpty(data.cells)) {
      this.cells = mapValues(data.cells, cellData =>
        new TheThingCell().fromJSON(cellData)
      );
    }
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }
}
