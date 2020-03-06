import {
  extend,
  isEmpty,
  filter,
  pickBy,
  mapValues,
  get,
  isArray,
  keyBy
} from 'lodash';
import {
  generateID,
  SerializableJSON,
  toJSONDeep
} from '@ygg/shared/infra/data-access';
import { TheThing } from './the-thing';
import { ImageThumbnailItem } from '@ygg/shared/ui/widgets';
import {
  TheThingCellComparator,
  TheThingCellTypes,
  TheThingCellDefine,
  TheThingCell
} from './cell';
import { TheThingFilter } from './filter';
import {
  TheThingValidator,
  TheThingValidatorBasic,
  TheThingValidateError
} from './validator';
import { Tags } from '@ygg/tags/core';
import { RelationDef } from './relation-def';

export const ImitationsDataPath = 'the-thing/imitations';

export interface DataTableConfig {
  columns: {
    [key: string]: {
      label: string;
    };
  };
}

export class TheThingImitation implements ImageThumbnailItem, SerializableJSON {
  id: string;
  name: string;
  image: string;
  description: string;
  view: string;
  // templateId: string;
  filter: TheThingFilter;
  cellsDef: { [name: string]: TheThingCellDefine } = {};
  dataTableConfig?: DataTableConfig;
  validators: TheThingValidator[] = [];
  relationsDef: { [name: string]: RelationDef } = {};

  /** Create time */
  createAt: number;

  constructor(options: any = {}) {
    this.id = generateID();
    this.createAt = new Date().valueOf();
    this.view = 'basic';

    this.fromJSON(options);
  }

  createTheThing(): TheThing {
    const theThing = new TheThing();
    if (this.filter && this.filter.tags) {
      theThing.tags = new Tags(this.filter.tags);
    }
    theThing.view = this.view;
    for (const cellName in this.cellsDef) {
      if (this.cellsDef.hasOwnProperty(cellName)) {
        const cellDef = this.cellsDef[cellName];
        theThing.addCell(TheThingCell.fromDef(cellDef));
      }
    }
    for (const name in this.relationsDef) {
      if (this.relationsDef.hasOwnProperty(name)) {
        theThing.addRelation(name);
      }
    }
    return theThing;
  }

  getRequiredCellDefs(): TheThingCellDefine[] {
    return filter(this.cellsDef, cellDef => cellDef.required);
  }

  getRequiredCellNames(): string[] {
    return this.getRequiredCellDefs().map(cellDef => cellDef.name);
  }

  getOptionalCellDefs(): TheThingCellDefine[] {
    return filter(this.cellsDef, cellDef => !cellDef.required);
  }

  getOptionalCellNames(): string[] {
    return this.getOptionalCellDefs().map(cellDef => cellDef.name);
  }

  getComparators(): { [cellName: string]: TheThingCellComparator } {
    return pickBy(
      mapValues(this.cellsDef, cellDef =>
        get(TheThingCellTypes, `${cellDef.type}.comparator`, null)
      ),
      cf => typeof cf === 'function'
    );
  }

  validate(theThing: TheThing): TheThingValidateError[] {
    if (isEmpty(this.validators)) {
      const basicValidator = new TheThingValidatorBasic({
        requiredCells: this.getRequiredCellDefs()
      });
      this.validators.push(basicValidator);
    }
    let errors: TheThingValidateError[] = [];
    for (const validator of this.validators) {
      errors = errors.concat(validator.validate(theThing));
    }
    return errors;
  }

  addRelationDef(rDef: RelationDef) {
    this.relationsDef[rDef.name] = rDef;
  }

  hasRelationDef(relationName: string): boolean {
    return !isEmpty(this.relationsDef) && relationName in this.relationsDef;
  }

  getRelationDef(relationName: string): RelationDef {
    return this.hasRelationDef(relationName)
      ? this.relationsDef[relationName]
      : null;
  }

  fromJSON(data: any = {}): this {
    extend(this, data);
    if (isArray(data.cellsDef)) {
      this.cellsDef = keyBy(data.cellsDef, 'name');
    }
    if (data.filter) {
      this.filter = new TheThingFilter().fromJSON(data.filter);
    }
    if (!isEmpty(data.relationsDef)) {
      if (isArray(data.relationsDef)) {
        this.relationsDef = keyBy(
          data.relationsDef.map(rDef => new RelationDef(rDef)),
          'name'
        );
      } else {
        this.relationsDef = mapValues(
          data.relationsDef,
          rDef => new RelationDef(rDef)
        );
      }
    }
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }
}
