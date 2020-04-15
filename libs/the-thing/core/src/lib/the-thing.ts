import {
  extend,
  isArray,
  sampleSize,
  sample,
  random,
  remove,
  keyBy,
  isEmpty,
  mapValues,
  omit,
  assign,
  pick,
  values,
  castArray,
  flatten
} from 'lodash';
import { Tags } from '@ygg/tags/core';
import { TheThingCell } from './cell';
import { OmniTypeID } from '@ygg/shared/omni-types/core';
import { generateID, toJSONDeep, Entity } from '@ygg/shared/infra/data-access';
import { ImageThumbnailItem } from '@ygg/shared/ui/widgets';
import { TheThingRelation } from './relation';
import { TheThingState } from './state';

export class TheThing implements Entity, ImageThumbnailItem {
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
  relations: { [name: string]: TheThingRelation[] };

  /**
   * For ImageThumbnailItem interface
   */
  image: string;

  /**
   * Link for detail page or external reference
   */
  link: string;

  /**
   * Boolean flags for combination of complex state
   */
  flags: { [name: string]: boolean } = {};

  /**
   * State indicators for several imitation states
   */
  states: { [name: string]: number } = {};
  stateTimestamps: { [name: string]: Date } = {};

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
    thing.image =
      options.image ||
      'https://live.staticflickr.com/6130/6019458291_4e512065fd.jpg';

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

  hasCell(cell: TheThingCell | string, type?: OmniTypeID): boolean {
    let cellName: string;
    if (typeof cell === 'string') {
      cellName = cell;
    } else {
      cellName = cell.name;
    }
    if (!(cellName in this.cells)) {
      return false;
    }
    if (type && this.cells[cellName].type !== type) {
      return false;
    }
    return true;
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

  updateCellValues(cellValues: { [name: string]: any }) {
    for (const name in cellValues) {
      if (cellValues.hasOwnProperty(name)) {
        const value = cellValues[name];
        if (this.hasCell(name)) {
          this.cells[name].value = value;
        }
      }
    }
  }

  deleteCell(cellName: TheThingCell | string) {
    cellName = typeof cellName === 'string' ? cellName : cellName.name;
    if (this.hasCell(cellName)) {
      delete this.cells[cellName];
    }
  }

  deleteCells(cells: string[] | TheThingCell[]) {
    for (const cell of cells) {
      this.deleteCell(cell);
    }
  }

  clearCells() {
    this.cells = {};
  }

  getCell(cellName: string): TheThingCell {
    try {
      return this.cells[cellName];
    } catch (error) {
      console.warn(`Failed to get cell from ${cellName}: ${error.message}`);
      return null;
    }
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

  getCellValuesByNames(cellNames: string[]): { [cellName: string]: any } {
    return mapValues(pick(this.cells, cellNames), cell => cell.value);
  }

  hasRelation(relationName: string) {
    return (
      relationName in this.relations && !isEmpty(this.relations[relationName])
    );
  }

  addRelation(...args: any[]) {
    if (!args || args.length <= 0) {
      throw Error(
        `Incorrect arguments for TheThing.addRelation(): ${JSON.stringify(
          args
        )}`
      );
    }

    if (args.length === 1 && TheThingRelation.isTheThingRelation(args[0])) {
      const relation: TheThingRelation = args[0];
      if (!(relation.name in this.relations)) {
        this.relations[relation.name] = [];
      }
      this.relations[relation.name].push(relation);
    } else {
      const relationName = args[0];
      if (!(relationName in this.relations)) {
        this.relations[relationName] = [];
      }

      if (args.length >= 2) {
        let objectId: string;
        if (typeof args[1] === 'string') {
          objectId = args[1];
        } else {
          objectId = args[1].id;
        }

        let cells: TheThingCell[] = [];
        if (args.length >= 3 && !isEmpty(args[2])) {
          cells = args[2];
        }

        const newRelation = new TheThingRelation({
          name: relationName,
          subjectId: this.id,
          objectId: objectId,
          cells: keyBy(cells, 'name')
        });
        this.relations[relationName].push(newRelation);
      }
    }
  }

  addRelations(
    relationName: string,
    objects: TheThing[] | string[] | TheThingRelation[]
  ) {
    for (const object of objects) {
      this.addRelation(relationName, object);
    }
  }

  setRelation(relationName: string, relations: TheThingRelation[]) {
    this.removeRelation(relationName);
    for (const relation of relations) {
      this.addRelation(relation);
    }
  }

  removeRelation(relationName, objectId?: TheThing | string) {
    if (!objectId) {
      delete this.relations[relationName];
    } else {
      if (typeof objectId !== 'string') {
        objectId = objectId.id;
      }
      if (this.relations && relationName in this.relations) {
        remove(
          this.relations[relationName],
          relation => relation.objectId === objectId
        );
        if (isEmpty(this.relations[relationName])) {
          delete this.relations[relationName];
        }
      }
    }
  }

  getRelations(relationNames: string | string[]): TheThingRelation[] {
    relationNames = castArray(relationNames);
    return flatten(
      relationNames.map(relationName =>
        this.hasRelation(relationName) ? this.relations[relationName] : []
      )
    );
  }

  /**
   * Get the object ids of specified relation name
   *
   * @param relationName relation name
   */
  getRelationObjectIds(relationName: string): string[] {
    if (this.hasRelation(relationName)) {
      return this.relations[relationName].map(relation => relation.objectId);
    } else {
      return [];
    }
  }

  /**
   * Get the only one relation object's id
   */
  getRelationObjectId(): string {
    for (const key in this.relations) {
      if (this.relations.hasOwnProperty(key)) {
        const relationObjectIds = this.relations[key].map(
          relation => relation.objectId
        );
        if (!isEmpty(relationObjectIds)) {
          return relationObjectIds[0];
        }
      }
    }
    return null;
  }

  clone(): TheThing {
    return new TheThing().fromJSON(
      omit(this.toJSON(), [
        'id',
        'createAt',
        'modifyAt',
        'ownerId',
        'link',
        'flags',
        'states',
        'stateTimestamps'
      ])
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

  imitate(victim: TheThing) {
    if (!victim) {
      throw new Error(`No imitate victim, @#$%&^%~!!!`);
    }
    this.tags = this.tags.merge(victim.tags);
    if (victim.view) {
      this.view = victim.view;
    }
    for (const key in victim.cells) {
      if (victim.cells.hasOwnProperty(key)) {
        const victimCell = victim.cells[key];
        if (!this.hasCell(victimCell)) {
          this.addCell(victimCell.clone());
        }
      }
    }
  }

  setFlag(name: string, flag: boolean) {
    this.flags[name] = flag;
  }

  getFlag(name: string): boolean {
    return name in this.flags ? this.flags[name] : false;
  }

  setState(name: string, state: TheThingState, timestamp: Date = new Date()) {
    this.states[name] = state.value;
    this.stateTimestamps[`${name}__${state.value}`] = timestamp;
  }

  getState(name: string): number {
    return name in this.states ? this.states[name] : -1;
  }

  isState(name: string, value: number): boolean {
    return this.getState(name) === value;
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
          data.cells = keyBy(data.cells, 'name');
        }
        this.cells = mapValues(data.cells, cellData =>
          new TheThingCell().fromJSON(cellData)
        );
      }
      if (data.relations) {
        this.relations = mapValues(data.relations, relations =>
          relations.map(relation => new TheThingRelation(relation))
        );
      }
      // console.log(`TheThing.fromJSON: ${this.image}`);
      if (!this.image) {
        this.image = this.resolveImage();
      }

      if (data.stateTimestamps) {
        this.stateTimestamps = mapValues(
          data.stateTimestamps,
          t => new Date(t)
        );
      }
    }
    if (!this.link) {
      this.link = `/the-things/${this.id}`;
    }
    return this;
  }

  toJSON(): any {
    const data = toJSONDeep(this);
    for (const name in data.relations) {
      if (data.relations.hasOwnProperty(name)) {
        const relations = data.relations[name];
        if (isEmpty(relations)) {
          delete data.relations[name];
        }
      }
    }
    return data;
  }
}
