import { TheThingCell } from './cell';
import {
  extend,
  isEmpty,
  mapValues,
  get,
  isArray,
  keyBy,
  defaults,
  reduce,
  isEqual
} from 'lodash';
import { Entity, SerializableJSON, toJSONDeep } from '@ygg/shared/infra/core';
import { config } from './config';
import { Relationship } from './relationship';

export class RelationRecord implements Entity, SerializableJSON {
  static collection = 'relations';

  id: string;
  subjectCollection: string;
  subjectId: string;
  objectCollection: string;
  objectId: string;
  objectRole: string;
  createAt: Date;
  data?: any;

  static findLatest(relations: RelationRecord[]): RelationRecord {
    return reduce(
      relations,
      (result: RelationRecord, r: RelationRecord) => {
        if (!result || result.createAt < r.createAt) {
          return r;
        } else {
          return result;
        }
      },
      null
    );
  }

  static constructId(
    subjectId: string,
    objectRole: string,
    objectId: string
  ): string {
    return `${subjectId}_${objectRole}_${objectId}`;
  }

  constructor(options?: {
    subjectCollection: string;
    subjectId: string;
    objectCollection: string;
    objectId: string;
    objectRole: string;
    data?: any;
  }) {
    extend(this, options);
    this.id = RelationRecord.constructId(
      this.subjectId,
      this.objectRole,
      this.objectId
    );
    this.createAt = new Date();
  }

  isEqual(that: RelationRecord): boolean {
    return isEqual(this.toJSON(), that.toJSON());
  }

  fromJSON(data: any): this {
    extend(this, data);
    if (data) {
      if (data.createAt) {
        this.createAt = new Date(data.createAt);
      }
    }
    return this;
  }

  toJSON(): any {
    const data: any = toJSONDeep(this);
    if (this.createAt) {
      data.createAt = this.createAt.toISOString();
    }
    return data;
  }
}

export interface ITheThingRelation {
  name: string;
  subjectId: string;
  objectId: string;
  cells?: TheThingCell[] | { [name: string]: TheThingCell };
}

export class TheThingRelation implements SerializableJSON {
  get id(): string {
    return `${this.subjectId}_${this.name}_${this.objectId}`;
  }
  name: string;
  subjectCollection: string;
  subjectId: string;
  objectCollection: string;
  objectId: string;
  cells: { [name: string]: TheThingCell } = {};

  static isTheThingRelation(value: any): value is TheThingRelation {
    return value && value.name && value.objectCollection && value.objectId;
  }

  constructor(options?: {
    name: string;
    subjectCollection?: string;
    objectCollection?: string;
    subjectId: string;
    objectId: string;
    cells?: TheThingCell[] | { [name: string]: TheThingCell };
  }) {
    options = defaults(options, {
      subjectCollection: config.collection,
      objectCollection: config.collection
    });
    options.cells = isArray(options.cells)
      ? keyBy(options.cells, 'name')
      : options.cells;
    extend(this, options);
  }

  addCell(cell: TheThingCell) {
    this.cells[cell.name] = cell;
  }

  getCellValue(cellName: string, defaultValue?: any): any {
    defaultValue = typeof defaultValue === 'undefined' ? null : defaultValue;
    return get(this.cells, `${cellName}.value`, defaultValue);
  }

  setCellValue(cellName: string, value: any): any {
    this.cells[cellName].value = value;
  }

  toRelationRecord(): RelationRecord {
    return new RelationRecord({
      subjectCollection: this.subjectCollection,
      subjectId: this.subjectId,
      objectCollection: this.objectCollection,
      objectId: this.objectId,
      objectRole: this.name,
      data: toJSONDeep({ cells: this.cells })
    });
  }

  fromJSON(data: any): this {
    extend(this, data);
    if (!isEmpty(data.cells)) {
      this.cells = mapValues(
        isArray(data.cells) ? keyBy(data.cells, 'name') : data.cells,
        cell => new TheThingCell().fromJSON(cell)
      );
    }
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }
}
