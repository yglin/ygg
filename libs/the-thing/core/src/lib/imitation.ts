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
  find,
  values,
  noop,
  defaults,
  random,
  pick
} from 'lodash';
import {
  generateID,
  SerializableJSON,
  toJSONDeep
} from '@ygg/shared/infra/core';
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
import { RelationDefine } from './relation-def';
import { TheThingCellDefine } from './cell-define';
import {
  OmniTypeComparator,
  OmniTypes,
  Image
} from '@ygg/shared/omni-types/core';
import { TheThingState } from './state';
import { Relationship } from './relationship';
import { TheThingAction } from './action';

export const ImitationsDataPath = 'the-thing/imitations';

type ValueSource = 'cell' | 'function';
type ValueFunction = (thing: TheThing) => any;

export interface DataTableColumnConfig {
  name: string;
  label: string;
  valueSource?: ValueSource | string;
  valueFunc?: ValueFunction;
}

export interface DataTableConfig {
  columns: {
    [key: string]: DataTableColumnConfig;
  };
}

export interface DisplayThumbnail {
  cells: string[];
}

export interface ImitationDisplayConfig {
  thumbnail?: DisplayThumbnail;
}

export type ImitationStateChangesId = 'initial' | 'onSave';
export type ImitationStateChanges = {
  [key in ImitationStateChangesId]?: {
    previous?: TheThingState;
    next: TheThingState;
  };
};

type TheThingCreator = (thing: TheThing) => TheThing;

export class TheThingImitation implements ImageThumbnailItem, SerializableJSON {
  collection = 'the-things';
  id: string;
  name: string;
  icon: string;
  image: string;
  description: string;
  view: string;
  editor: string;
  routePath?: string;
  // templateId: string;
  filter: TheThingFilter;
  cellsDef: { [name: string]: TheThingCellDefine } = {};
  dataTableConfig?: DataTableConfig;
  validators: TheThingValidator[] = [];
  relationsDef: { [name: string]: RelationDefine } = {};
  relationships: { [name: string]: Relationship } = {};
  valueFunctions: { [name: string]: ValueFunction } = {};
  stateName: string;
  states: { [name: string]: TheThingState };
  creators: TheThingCreator[] = [];
  cellsOrder: string[] = [];
  displays: ImitationDisplayConfig = {};
  actions: { [id: string]: TheThingAction } = {};
  pipes: { [source: string]: (theThing: TheThing) => void } = {};
  admin: {
    states?: string[];
  } = {};
  stateChanges: ImitationStateChanges = {};

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

  preSave?: (theThing: TheThing) => TheThing = (theThing: TheThing) => theThing;
  canModify?: (theThing: TheThing) => boolean = () => true;

  constructor(
    options: {
      id?: string;
      name?: string;
      icon?: string;
      collection?: string;
      cellsDef?: TheThingCellDefine[];
      displays?: ImitationDisplayConfig;
      filter?: TheThingFilter;
      stateName?: string;
      states?: { [name: string]: TheThingState };
      creators?: TheThingCreator[];
      cellsOrder?: string[];
      canModify?: (theThing: TheThing) => boolean;
      preSave?: (theThing: TheThing) => TheThing;
      actions?: { [id: string]: TheThingAction };
      stateChanges?: ImitationStateChanges;
      [key: string]: any;
    } = {}
  ) {
    this.id = generateID();
    this.createAt = new Date().valueOf();
    this.view = 'basic';
    this.filter = new TheThingFilter();
    this.fromJSON(options);
    defaults(this, options);
    this.stateName = this.stateName || `${this.id}_state`;
  }

  setRequiredCells(cellDefs: TheThingCellDefine[]) {
    for (const cellDef of cellDefs) {
      this.cellsDef[cellDef.id] = cellDef;
    }
  }

  createCell(name: string, value: any): TheThingCell {
    const cellDef = this.getCellDef(name);
    return cellDef.createCell(value);
  }

  getCellDef(name: string): TheThingCellDefine {
    return name in this.cellsDef ? this.cellsDef[name] : null;
  }

  forgeTheThing(): TheThing {
    const theThing = this.createTheThing();
    theThing.name = `${this.name}_這是一個假造資料_${Date.now()}`;
    for (const cellId in this.cellsDef) {
      if (this.cellsDef.hasOwnProperty(cellId)) {
        const cellDef = this.cellsDef[cellId];
        if (cellDef.userInput === 'required' || random(1, true) > 0.5) {
          const cell = theThing.getCell(cellId);
          if (!cell || !cell.value) {
            theThing.upsertCell(cellDef.forgeCell());
          }
        }
      }
    }
    theThing.image = theThing.resolveImage();
    if (!theThing.image) {
      theThing.image = Image.forge().src;
    }
    return theThing;
  }

  createTheThing(source?: TheThing): TheThing {
    try {
      let theThing = new TheThing();
      if (this.collection) {
        theThing.collection = this.collection;
      }
      if (this.image) {
        theThing.image = this.image;
      }
      if (this.filter && this.filter.tags) {
        theThing.tags = new Tags(this.filter.tags);
      }
      theThing.view = this.view;
      if (source) {
        defaults(theThing, pick(source, ['name', 'image']));
      }
      for (const cellId in this.cellsDef) {
        if (this.cellsDef.hasOwnProperty(cellId)) {
          const cellDef = this.cellsDef[cellId];
          if (cellDef.userInput === 'required') {
            const newCell = cellDef.createCell();
            theThing.upsertCell(newCell);
          }
          if (source && source.hasCell(cellId)) {
            // console.log(`Copy cell ${cellId}`);
            // console.log(source.getCellValue(cellId));
            theThing.upsertCell(
              cellDef.createCell(source.getCellValue(cellId))
            );
          }
        }
      }
      if ('initial' in this.stateChanges) {
        this.setState(theThing, this.stateChanges['initial'].next);
      }
      if (!!this.routePath) {
        theThing.link = `/${this.routePath}/${theThing.id}`;
      } else {
        theThing.link = `/the-things/${this.id}/${theThing.id}`;
      }
      if (!isEmpty(this.creators)) {
        // console.log(this.creators);
        for (const creator of this.creators) {
          theThing = creator(theThing);
        }
      }
      // console.log(`Created TheThing ${theThing.id}`);
      return theThing;
    } catch (error) {
      const wrapError = new Error(
        `Failed to create TheThing of imitation ${this.name}.\n${error.message}`
      );
      throw wrapError;
    }
  }

  getFirstRequiredCellDef(): TheThingCellDefine {
    const requireds = this.getRequiredCellDefs();
    return isEmpty(requireds) ? null : requireds[0];
  }

  getRequiredCellDefs(): TheThingCellDefine[] {
    let requireds = filter(
      this.cellsDef,
      cellDef => cellDef.userInput === 'required'
    );
    if (!isEmpty(this.cellsOrder)) {
      requireds = requireds.sort((cellA, cellB) => {
        const indexA = this.cellsOrder.indexOf(cellA.id);
        const indexB = this.cellsOrder.indexOf(cellB.id);
        return indexA > indexB ? 1 : -1;
      });
    }
    return requireds;
  }

  getRequiredCellIds(): string[] {
    return this.getRequiredCellDefs().map(cellDef => cellDef.id);
  }

  getOptionalCellDefs(): TheThingCellDefine[] {
    return filter(this.cellsDef, cellDef => cellDef.userInput === 'optional');
  }

  getOptionalCellIds(): string[] {
    return this.getOptionalCellDefs().map(cellDef => cellDef.id);
  }

  createOptionalCells(): TheThingCell[] {
    return this.getOptionalCellDefs().map(cellDef => cellDef.createCell());
  }

  getComparators(): { [cellId: string]: OmniTypeComparator } {
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

  isValid(theThing: TheThing): boolean {
    return isEmpty(this.validate(theThing));
  }

  addRelationDefine(rDef: RelationDefine) {
    this.relationsDef[rDef.name] = rDef;
  }

  hasRelationDefine(relationName: string): boolean {
    return !isEmpty(this.relationsDef) && relationName in this.relationsDef;
  }

  getRelationDefine(relationName: string): RelationDefine {
    return this.hasRelationDefine(relationName)
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

  getState(theThing: TheThing): TheThingState {
    return this.stateName in theThing.states
      ? find(this.states, st => st.value === theThing.states[this.stateName])
      : null;
  }

  getStateLabel(stateValue: number): string {
    const state = find(this.states, s => s.value === stateValue);
    return !!state ? state.label : '未知狀態';
  }

  pickNonRequiredCells(cells: TheThingCell[]): TheThingCell[] {
    return cells.filter(c => {
      const cellDef = this.getCellDef(c.id);
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

  setState(theThing: TheThing, state: TheThingState) {
    theThing.states[this.stateName] = state.value;
    theThing.stateTimestamps[`${this.stateName}__${state.value}`] = new Date();
  }

  isState(theThing: TheThing, state: TheThingState) {
    return (
      this.stateName in theThing.states &&
      theThing.states[this.stateName] === state.value
    );
  }

  isInStates(theThing: TheThing, states: TheThingState[]): boolean {
    for (const state of states) {
      if (this.isState(theThing, state)) {
        return true;
      }
    }
    return false;
  }

  fromJSON(data: any = {}): this {
    extend(this, data);
    if (!isEmpty(data.cellsDef)) {
      let cellsDef = data.cellsDef;
      if (!isArray(data.cellsDef)) {
        cellsDef = values(data.cellsDef);
      }
      this.cellsDef = keyBy(
        cellsDef
          .filter(cd => TheThingCellDefine.isTheThingCellDefine(cd))
          .map(cd => new TheThingCellDefine(cd)),
        'id'
      );
      // mapValues(cellsDef, cellDef => new TheThingCellDefine(cellDef));
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
        rDef => new RelationDefine(rDef)
      );
    }
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }
}
