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
  TheThingCellDefine
} from './cell';
import { TheThingFilter } from './filter';

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
  templateId: string;
  filter: TheThingFilter;
  cellsDef: { [name: string]: TheThingCellDefine } = {};
  dataTableConfig?: DataTableConfig;

  /** Create time */
  createAt: number;

  constructor(...args: any[]) {
    this.id = generateID();
    this.createAt = new Date().valueOf();

    let template: TheThing;
    let options: any = {};
    if (!isEmpty(args)) {
      if (args.length >= 1) {
        template = args[0];
      }
      if (args.length >= 2) {
        options = args[1];
      }
    }
    extend(this, options);
    if (template) {
      this.setTemplate(template);
    }
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

  setTemplate(template: TheThing) {
    // console.log(template);
    if (!this.image) {
      this.image = template.resolveImage();
    }
    this.templateId = template.id;
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
