import { extend, isEmpty, filter, pickBy, mapValues, get } from 'lodash';
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

  /** Create time */
  createAt: number;

  constructor(options: any = {}) {
    this.id = generateID();
    this.createAt = new Date().valueOf();
    this.view = 'basic';

    // let template: TheThing;
    // let options: any = {};
    // if (!isEmpty(args)) {
    //   if (args.length >= 1) {
    //     template = args[0];
    //   }
    //   if (args.length >= 2) {
    //     options = args[1];
    //   }
    // }
    extend(this, options);
    // if (template) {
    //   this.setTemplate(template);
    // }
  }

  createTheThing(): TheThing {
    const theThing = new TheThing();
    theThing.tags = new Tags(this.filter.tags);
    theThing.view = this.view;
    const requiredCellDefs = this.getRequiredCellDefs();
    for (const cellDef of requiredCellDefs) {
      theThing.addCell(TheThingCell.fromDef(cellDef));
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

  // setTemplate(template: TheThing) {
  //   // console.log(template);
  //   if (!this.image) {
  //     this.image = template.resolveImage();
  //   }
  //   this.templateId = template.id;
  // }

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

  fromJSON(data: any = {}): this {
    extend(this, data);
    if (data.filter) {
      this.filter = new TheThingFilter().fromJSON(data.filter);
    }
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }
}
