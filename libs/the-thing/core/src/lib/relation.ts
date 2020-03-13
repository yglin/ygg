import { SerializableJSON, toJSONDeep } from '@ygg/shared/infra/data-access';
import { TheThing } from './the-thing';
import { TheThingCell } from './cell';
import { extend, isEmpty, mapValues, get, isArray, keyBy } from 'lodash';

export interface ITheThingRelation {
  name: string;
  subjectId: string;
  objectId: string;
  cells?: { [name: string]: TheThingCell };
}

export class TheThingRelation implements SerializableJSON {
  id: string;
  name: string;
  subjectId: string;
  objectId: string;
  cells: { [name: string]: TheThingCell } = {};

  constructor(options?: ITheThingRelation) {
    if (options) {
      this.fromJSON(options);
    }
  }

  addCell(cell: TheThingCell) {
    this.cells[cell.name] = cell;
  }

  getCellValue(cellName: string, defaultValue?: any): any {
    defaultValue = typeof defaultValue === 'undefined' ? null : defaultValue;
    return get(this.cells, `${cellName}.value`, defaultValue);
  }

  fromJSON(data: ITheThingRelation): this {
    extend(this, data);
    this.id = `${this.name}_${this.subjectId}_${this.objectId}`;
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
