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
  uniq,
  omit,
  assign,
  pick,
  values
} from 'lodash';
import { Tags } from '@ygg/tags/core';
import { TheThingCell } from './cell';
import { generateID, toJSONDeep } from '@ygg/shared/infra/data-access';
import { ImageThumbnailItem } from '@ygg/shared/ui/widgets';

export class TheThing implements ImageThumbnailItem {
  static collection = 'the-things';

  id: string;

  /** Category, group, table, or collection name */
  collection: string;

  /** Owner's user id */
  ownerId: string;

  /** Display name */
  name: string;

  //** Type tags for query and search */
  tags: Tags;

  /** Create time */
  createAt: number;

  /** Last modified time */
  modifyAt: number;

  // /** Imitation id */
  // imitation: string;

  /** TheThingView id */
  view: string;

  /** TheThingCells, define its own properties, attributes */
  cells: { [name: string]: TheThingCell };

  /**
   * External relations, linked to other the-things.
   * Store mappings from relation name to ids of objects
   **/
  relations: { [name: string]: string[] };

  /**
   * For ImageThumbnailItem interface
   */
  image: string;

  /**
   * Link for detail page or external reference
   */
  link: string;

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

  hasTags(tags: string[]): boolean {
    return this.tags.include(tags);
  }

  hasCell(cell: TheThingCell | string): boolean {
    let cellName: string;
    if (typeof cell === 'string') {
      cellName = cell;
    } else {
      cellName = cell.name;
    }
    return cellName in this.cells;
  }

  getCellsByNames(names: string[]): TheThingCell[] {
    return values(pick(this.cells, names));
  }

  addCell(cell: TheThingCell) {
    this.cells[cell.name] = cell;
  }

  addCells(cells: TheThingCell[]) {
    for (const cell of cells) {
      this.addCell(cell);
    }
  }

  updateCells(cells: { [key: string]: TheThingCell }) {
    assign(this.cells, cells);
  }

  deleteCell(cell: TheThingCell) {
    if (this.hasCell(cell)) {
      delete this.cells[cell.name];
    }
  }

  clearCells() {
    this.cells = {};
  }

  getCellValue(cellName: string): any {
    try {
      return this.cells[cellName].value;
    } catch (error) {
      console.warn(
        `Failed to get cell value from ${cellName}: ${error.message}`
      );
      return null;
    }
  }

  hasRelation(relationName: string) {
    return (
      relationName in this.relations && !isEmpty(this.relations[relationName])
    );
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

  clone(): TheThing {
    return new TheThing().fromJSON(
      omit(this.toJSON(), ['id', 'createAt', 'modifyAt'])
    );
  }

  /**
   * Try to resolve image src from cells data
   */
  resolveImage(): string {
    let imageSrc: string;
    for (const key in this.cells) {
      if (this.cells.hasOwnProperty(key)) {
        const cell = this.cells[key];
        if (
          cell.type === 'album' &&
          cell.value &&
          cell.value.cover &&
          cell.value.cover.src
        ) {
          imageSrc = cell.value.cover.src;
          break;
        }
      }
    }
    return imageSrc;
  }

  applyTemplate(template: TheThing) {
    this.fromJSON(template.toJSON());
  }

  fromJSON(data: any): this {
    // console.dir(data);
    extend(this, data);
    // console.dir(this);
    if (data) {
      if (data.tags) {
        this.tags = Tags.fromJSON(data.tags);
      }
      if (!isEmpty(data.cells)) {
        if (isArray(data.cells)) {
          this.cells = keyBy(data.cells, 'name');
        }
        this.cells = mapValues(this.cells, cellData =>
          new TheThingCell().fromJSON(cellData)
        );
      }
      if (!this.image) {
        this.image = this.resolveImage();
      }
    }
    if (!this.link) {
      this.link = `/the-things/${this.id}`;
    }
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }
}
