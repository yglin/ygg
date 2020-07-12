import { extend, defaults } from 'lodash';
import { TheThingImitation } from './imitation';
import { TheThingCellDefine } from './cell-define';
import { TheThingRelation } from './relation';
import { TheThingCell } from './cell';
import { TheThing } from './the-thing';

export class Relationship {
  name: string;
  subjectCollection: string;
  objectCollection: string;
  imitation?: TheThingImitation;
  cellDefines?: { [key: string]: TheThingCellDefine };

  constructor(options: {
    name: string;
    subjectCollection?: string;
    objectCollection?: string;
    imitation?: TheThingImitation;
    cellDefines?: { [key: string]: TheThingCellDefine };
  }) {
    options = defaults(options, {
      subjectCollection: TheThing.collection,
      objectCollection: TheThing.collection
    });
    extend(this, options);
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
