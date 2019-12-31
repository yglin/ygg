import { extend, isArray, sampleSize, sample, random, range } from 'lodash';
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
    if (isArray(options.cells)) {
      thing.cells = options.cells;
    } else {
      thing.cells = range(random(2,6)).map(() => TheThingCell.forge());
    }
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
