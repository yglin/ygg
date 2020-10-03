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
  flatten,
  find,
  uniq,
  difference
} from 'lodash';
import { Tags } from '@ygg/tags/core';
import { TheThingCell } from './cell';
import { OmniTypeID, Image, TimeRange } from '@ygg/shared/omni-types/core';
import {
  generateID,
  toJSONDeep,
  Entity,
  hashStringToColor
} from '@ygg/shared/infra/core';
import { ImageThumbnailItem } from '@ygg/shared/ui/widgets';
import { TheThingRelation, RelationRecord } from './relation';
import { TheThingState } from './state';
import { DeserializerJSON, SerializerJSON } from '@ygg/shared/infra/core';
import { config } from './config';

export class TheThing implements Entity, ImageThumbnailItem {
  static collection = config.collection;

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
   * Related user ids, grouped by role
   */
  users: { [role: string]: string[] } = {};

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
   * For visual identification
   */
  get color(): string {
    return hashStringToColor(this.name);
  }

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

  static serializerJSON: SerializerJSON = (item: TheThing): any => {
    const data = toJSONDeep(item);
    for (const name in data.relations) {
      if (data.relations.hasOwnProperty(name)) {
        const relations = data.relations[name];
        if (isEmpty(relations)) {
          delete data.relations[name];
        }
      }
    }
    return data;
  };

  static deserializerJSON: DeserializerJSON = (data: any): TheThing => {
    const theThing = new TheThing();
    theThing.fromJSON(data);
    return theThing;
  };

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
    thing.image = options.image || Image.forge().src;

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
        ).map(label => TheThingCell.forge({ label })),
        'id'
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

  hasCellOfType(type: OmniTypeID): boolean {
    for (const id in this.cells) {
      if (Object.prototype.hasOwnProperty.call(this.cells, id)) {
        const cell = this.cells[id];
        if (cell.type === type) {
          return true;
        }
      }
    }
    return false;
  }

  getCellValueOfType(type: OmniTypeID): any {
    for (const id in this.cells) {
      if (Object.prototype.hasOwnProperty.call(this.cells, id)) {
        const cell = this.cells[id];
        if (cell.type === type && (cell.value || cell.value === 0)) {
          return cell.value;
        }
      }
    }
    return null;
  }

  hasCell(cell: TheThingCell | string, type?: OmniTypeID): boolean {
    let cellId: string;
    if (typeof cell === 'string') {
      cellId = cell;
    } else {
      cellId = cell.id;
    }
    if (!(cellId in this.cells)) {
      return false;
    }
    if (type && this.cells[cellId].type !== type) {
      return false;
    }
    return true;
  }

  getCellsByNames(names: string[]): TheThingCell[] {
    return values(pick(this.cells, names));
  }

  upsertCell(cell: TheThingCell) {
    this.cells[cell.id] = cell;
  }

  upsertCells(cells: TheThingCell[]) {
    for (const cell of cells) {
      this.upsertCell(cell);
    }
  }

  updateCells(cells: { [key: string]: TheThingCell }) {
    assign(this.cells, cells);
  }

  updateCellValue(name: string, value: any) {
    if (this.hasCell(name)) {
      this.cells[name].value = value;
    } else {
      throw new Error(`${this.name} has no cell ${name}`);
    }
  }

  updateCellValues(cellValues: { [name: string]: any }) {
    for (const name in cellValues) {
      if (cellValues.hasOwnProperty(name)) {
        const value = cellValues[name];
        this.updateCellValue(name, value);
      }
    }
  }

  deleteCell(cellId: TheThingCell | string) {
    cellId = typeof cellId === 'string' ? cellId : cellId.id;
    if (this.hasCell(cellId)) {
      delete this.cells[cellId];
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

  getCell(cellId: string): TheThingCell {
    try {
      return this.cells[cellId];
    } catch (error) {
      console.warn(`Failed to get cell from ${cellId}: ${error.message}`);
      return null;
    }
  }

  setCellValue(cellId: string, value: any) {
    if (this.hasCell(cellId)) {
      this.cells[cellId].value = value;
    } else {
      console.warn(`Failed to setCellValue ${cellId}, cell not exists`);
    }
  }

  getCellValue(cellId: string): any {
    try {
      return this.cells[cellId].value;
    } catch (error) {
      console.warn(`Failed to get cell value from ${cellId}: ${error.message}`);
      return null;
    }
  }

  getCellValuesByNames(cellIds: string[]): { [cellId: string]: any } {
    return mapValues(pick(this.cells, cellIds), cell => cell.value);
  }

  /**
   * Set the uniq user of specified role
   *
   * @param role Name of role
   * @param userId The only user who plays the role
   */
  setUserOfRole(role: string, userId: string) {
    this.users[role] = [userId];
  }

  addUsersOfRole(role: string, userIds: string[]) {
    if (!(role in this.users)) {
      this.users[role] = [];
    }
    this.users[role] = uniq(this.users[role].concat(userIds));
  }

  removeUsersOfRole(role: string, userIds: string[]) {
    if (role in this.users) {
      this.users[role] = difference(this.users[role], userIds);
    }
  }

  listUserIdsOfRole(role: string): string[] {
    if (role in this.users) {
      return this.users[role];
    } else {
      return [];
    }
  }

  hasUserOfRole(role: string, userId: string): boolean {
    return (
      role in this.users &&
      !isEmpty(this.users[role]) &&
      this.users[role].indexOf(userId) >= 0
    );
  }

  hasRelation(relationName: string) {
    return (
      relationName in this.relations && !isEmpty(this.relations[relationName])
    );
  }

  hasRelationTo(relationName: string, objectId: string): boolean {
    if (this.hasRelation(relationName)) {
      for (const relation of this.relations[relationName]) {
        if (relation.objectId === objectId) {
          return true;
        }
      }
    }
    return false;
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
        if (TheThingRelation.isTheThingRelation(args[1])) {
          this.relations[relationName].push(args[1]);
        } else {
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

  getRelation(name: string, objectId: string): TheThingRelation {
    if (!this.hasRelation(name)) {
      return null;
    }
    const relations = this.relations[name];
    return find(relations, r => r.objectId === objectId);
  }

  getRelations(relationNames: string | string[]): TheThingRelation[] {
    relationNames = castArray(relationNames);
    return flatten(
      relationNames.map(relationName =>
        this.hasRelation(relationName) ? this.relations[relationName] : []
      )
    );
  }

  getAllRelations(): TheThingRelation[] {
    return flatten(values(this.relations));
  }

  generateRelationRecords(): RelationRecord[] {
    const records = [];
    for (const relationName in this.relations) {
      if (Object.prototype.hasOwnProperty.call(this.relations, relationName)) {
        const relations: TheThingRelation[] = this.relations[relationName];
        for (const relation of relations) {
          const relationRecord = new RelationRecord({
            subjectCollection: this.collection,
            subjectId: this.id,
            objectCollection: relation.objectCollection,
            objectId: relation.objectId,
            objectRole: relationName
          });
          records.push(relationRecord);
        }
      }
    }
    return records;
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
  getRelationObjectId(relationName: string): string {
    if (!this.hasRelation(relationName)) {
      throw new Error(`TheThing ${this.id} has no relation ${relationName}`);
    }
    const relationObjectIds = this.relations[relationName].map(
      relation => relation.objectId
    );
    if (isEmpty(relationObjectIds)) {
      throw new Error(
        `TheThing ${this.id} has relation ${relationName} but contains no object`
      );
    } else {
      return relationObjectIds[0];
    }
  }

  forEachRelation(handler: (relation: TheThingRelation) => void) {
    for (const relationName in this.relations) {
      if (Object.prototype.hasOwnProperty.call(this.relations, relationName)) {
        const relations = this.relations[relationName];
        for (const relation of relations) {
          handler(relation);
        }
      }
    }
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
          this.upsertCell(victimCell.clone());
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
          data.cells = keyBy(data.cells, 'id');
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
    // Clear out null cells
    if (!isEmpty(data.cells)) {
      for (const cellId in data.cells) {
        if (data.cells.hasOwnProperty(cellId)) {
          const cell = data.cells[cellId];
          if (!cell || cell.value === null || cell.value === undefined) {
            delete data.cells[cellId];
          }
        }
      }
    }
    // Clear out relations with no object
    if (!isEmpty(data.relations)) {
      for (const name in data.relations) {
        if (data.relations.hasOwnProperty(name)) {
          const relations = data.relations[name];
          if (isEmpty(relations)) {
            delete data.relations[name];
          }
        }
      }
    }
    return data;
  }
}
