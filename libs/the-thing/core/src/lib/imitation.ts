import {
  extend,
  isEmpty,
  filter,
  pickBy,
  mapValues,
  get,
  isArray,
  keyBy,
  clone,
  uniq,
  find
} from 'lodash';
import {
  generateID,
  SerializableJSON,
  toJSONDeep
} from '@ygg/shared/infra/data-access';
import { TheThing } from './the-thing';
import { ImageThumbnailItem } from '@ygg/shared/ui/widgets';
import { TheThingCell } from './cell';
import { TheThingFilter } from './filter';
import {
  TheThingValidator,
  TheThingValidatorBasic,
  TheThingValidateError
} from './validator';
import { Tags } from '@ygg/tags/core';
import { RelationDef } from './relation-def';
import { TheThingCellDefine } from './cell-define';
import { OmniTypeComparator, OmniTypes } from '@ygg/shared/omni-types/core';
import { TheThingState } from './state';
import { stat } from 'fs';

export const ImitationsDataPath = 'the-thing/imitations';

type ValueSource = 'cell' | 'function';
type ValueFunction = (thing: TheThing) => any;

export interface DataTableColumnConfig {
  name: string;
  label: string;
  valueSource?: ValueSource;
  valueFunc?: ValueFunction;
}

export interface DataTableConfig {
  columns: {
    [key: string]: DataTableColumnConfig;
  };
}

type TheThingCreator = (thing: TheThing) => TheThing;

export class TheThingImitation implements ImageThumbnailItem, SerializableJSON {
  id: string;
  name: string;
  icon: string;
  image: string;
  description: string;
  view: string;
  editor: string;
  // templateId: string;
  filter: TheThingFilter;
  cellsDef: { [name: string]: TheThingCellDefine } = {};
  dataTableConfig?: DataTableConfig;
  validators: TheThingValidator[] = [];
  relationsDef: { [name: string]: RelationDef } = {};
  valueFunctions: { [name: string]: ValueFunction } = {};
  stateName: string;
  states: { [name: string]: TheThingState };
  creators: TheThingCreator[] = [];
  cellsOrder: string[] = [];

  /** Create time */
  createAt: number;

  static isTheThingImitation(value: any): value is TheThingImitation {
    return !!(
      value &&
      value.id &&
      value.cellsDef &&
      typeof value.createTheThing === 'function'
    );
  }

  constructor(options: any = {}) {
    this.id = generateID();
    this.createAt = new Date().valueOf();
    this.view = 'basic';

    this.fromJSON(options);
  }

  createCell(name: string, value: any): TheThingCell {
    const cellDef = this.getCellDef(name);
    return cellDef.createCell(value);
  }

  getCellDef(name: string): TheThingCellDefine {
    return name in this.cellsDef ? this.cellsDef[name] : null;
  }

  createTheThing(): TheThing {
    let theThing = new TheThing();
    if (this.filter && this.filter.tags) {
      theThing.tags = new Tags(this.filter.tags);
    }
    theThing.view = this.view;
    for (const cellName in this.cellsDef) {
      if (this.cellsDef.hasOwnProperty(cellName)) {
        const cellDef = this.cellsDef[cellName];
        if (cellDef.userInput === 'required') {
          const newCell = cellDef.createCell();
          theThing.addCell(newCell);
        }
      }
    }
    // for (const name in this.relationsDef) {
    //   if (this.relationsDef.hasOwnProperty(name)) {
    //     theThing.addRelation(name);
    //   }
    // }
    if (!isEmpty(this.creators)) {
      for (const creator of this.creators) {
        theThing = creator(theThing);
      }
    }
    return theThing;
  }

  getRequiredCellDefs(): TheThingCellDefine[] {
    return filter(this.cellsDef, cellDef => cellDef.userInput === 'required');
  }

  getRequiredCellNames(): string[] {
    return this.getRequiredCellDefs().map(cellDef => cellDef.name);
  }

  getOptionalCellDefs(): TheThingCellDefine[] {
    return filter(this.cellsDef, cellDef => cellDef.userInput === 'optional');
  }

  getOptionalCellNames(): string[] {
    return this.getOptionalCellDefs().map(cellDef => cellDef.name);
  }

  createOptionalCells(): TheThingCell[] {
    return this.getOptionalCellDefs().map(cellDef => cellDef.createCell());
  }

  getComparators(): { [cellName: string]: OmniTypeComparator } {
    return pickBy(
      mapValues(this.cellsDef, cellDef =>
        get(OmniTypes, `${cellDef.type}.comparator`, null)
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

  /**
   * Create a new imitation extends the difinitions of this imitation
   *
   * @param data JSON data, the new difinitions, override properies of this
   */
  extend(imitation: any = {}): TheThingImitation {
    if (!TheThingImitation.isTheThingImitation(imitation)) {
      imitation = new TheThingImitation().fromJSON(imitation);
    }
    imitation.cellsDef = extend({}, this.cellsDef, imitation.cellsDef);
    imitation.relationsDef = extend(
      {},
      this.relationsDef,
      imitation.relationsDef
    );
    imitation.valueFunctions = extend(
      {},
      this.valueFunctions,
      imitation.valueFunctions
    );
    imitation.creators = [...this.creators, ...imitation.creators];
    imitation.validators = [...this.validators, ...imitation.validators];
    imitation.filter = this.filter.merge(imitation.filter);
    imitation.cellsOrder = uniq(this.cellsOrder.concat(imitation.cellsOrder));
    imitation.stateName = this.stateName || imitation.stateName;
    imitation.states = extend({}, this.states, imitation.states);
    return imitation;
  }

  getStateLabel(stateValue: number): string {
    const state = find(this.states, s => s.value === stateValue);
    return !!state ? state.label : '未知狀態';
  }

  pickNonRequiredCells(cells: TheThingCell[]): TheThingCell[] {
    return cells.filter(c => {
      const cellDef = this.getCellDef(c.name);
      if (
        !!cellDef &&
        (cellDef.userInput === 'required' || cellDef.userInput === 'hidden')
      ) {
        return false;
      } else {
        return true;
      }
    });
  }

  isState(theThing: TheThing, state: TheThingState) {
    return (
      this.stateName in theThing.states &&
      theThing.states[this.stateName] === state.value
    );
  }

  fromJSON(data: any = {}): this {
    extend(this, data);
    if (!isEmpty(data.cellsDef)) {
      let cellsDef = data.cellsDef;
      if (isArray(data.cellsDef)) {
        cellsDef = keyBy(data.cellsDef, 'name');
      }
      this.cellsDef = mapValues(
        cellsDef,
        cellDef => new TheThingCellDefine(cellDef)
      );
    }
    if (data.filter) {
      this.filter = new TheThingFilter().fromJSON(data.filter);
    }
    if (!isEmpty(data.relationsDef)) {
      let relationsDef = data.relationsDef;
      if (isArray(data.relationsDef)) {
        relationsDef = keyBy(data.relationsDef, 'name');
      }
      this.relationsDef = mapValues(
        relationsDef,
        rDef => new RelationDef(rDef)
      );
    }
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }
}
