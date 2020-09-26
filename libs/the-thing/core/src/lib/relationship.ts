import { extend, defaults } from 'lodash';
import { TheThingImitation } from './imitation';
import { TheThingCellDefine } from './cell-define';
import { TheThingRelation, RelationRecord } from './relation';
import { TheThingCell } from './cell';
import { TheThing } from './the-thing';
import { SerializableJSON } from '@ygg/shared/infra/core';

export class Relationship {
  name: string;
  label: string;
  subjectImitation: TheThingImitation;
  objectImitation: TheThingImitation;
  _subjectCollection: string;
  _objectCollection: string;
  imitation?: TheThingImitation;
  cellDefines?: { [key: string]: TheThingCellDefine };

  // Backward Compatibility
  get role(): string {
    return this.name;
  }

  // Backward Compatibility
  get subjectCollection(): string {
    if (this.subjectImitation && this.subjectImitation.collection) {
      return this.subjectImitation.collection;
    } else {
      return this._subjectCollection;
    }
  }

  // Backward Compatibility
  get objectCollection(): string {
    if (this.objectImitation && this.objectImitation.collection) {
      return this.objectImitation.collection;
    } else {
      return this._objectCollection;
    }
  }

  constructor(options: {
    name: string;
    label?: string;
    subjectImitation?: TheThingImitation;
    objectImitation?: TheThingImitation;
    subjectCollection?: string;
    objectCollection?: string;
    imitation?: TheThingImitation;
    cellDefines?: { [key: string]: TheThingCellDefine };
  }) {
    // options = defaults(options, {
    //   subjectCollection: TheThing.collection,
    //   objectCollection: TheThing.collection
    // });
    extend(this, options);
    if (options.subjectCollection) {
      this._subjectCollection = options.subjectCollection;
    }
    if (options.objectCollection) {
      this._objectCollection = options.objectCollection;
    }
    if (!this.label) {
      this.label = this.name;
    }
  }
    
  toJSON(): any {
    return {
      name: this.name,
      label: this.label,
      subjectImitation: this.subjectImitation ? this.subjectImitation.name : "",
      subjectCollection: this.subjectCollection || "",
      objectImitation: this.objectImitation ? this.objectImitation.name : "",
      objectCollection: this.objectCollection || ""
    }
  }

  createRelationRecord(
    subjectId: string,
    objectId: string,
    cellValues: { [key: string]: any } = {}
  ): RelationRecord {
    const record = new RelationRecord({
      subjectCollection: this.subjectCollection,
      subjectId: subjectId,
      objectCollection: this.objectCollection,
      objectId: objectId,
      objectRole: this.name,
      data: cellValues
    });
    return record;
  }

  createRelation(
    subjectId: string,
    objectId: string,
    cellValues: { [key: string]: any } = {}
  ): TheThingRelation {
    const cells: TheThingCell[] = [];
    for (const key in cellValues) {
      if (cellValues.hasOwnProperty(key)) {
        const value = cellValues[key];
        if (key in this.cellDefines) {
          const cell = this.cellDefines[key].createCell(value);
          cells.push(cell);
        }
      }
    }
    return new TheThingRelation({
      name: this.name,
      subjectCollection: this.subjectCollection,
      subjectId,
      objectCollection: this.objectCollection,
      objectId,
      cells
    });
  }
}
