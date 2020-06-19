import { extend } from 'lodash';
import { TheThingImitation } from './imitation';
import { TheThingCellDefine } from './cell-define';
import { TheThingRelation } from './relation';
import { TheThingCell } from './cell';

export class Relationship {
  name: string;
  imitation: TheThingImitation;
  cellDefines?: { [key: string]: TheThingCellDefine };

  constructor(options: {
    name: string;
    imitation: TheThingImitation;
    cellDefines?: { [key: string]: TheThingCellDefine };
  }) {
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
      subjectId,
      objectId,
      cells
    });
  }
}
