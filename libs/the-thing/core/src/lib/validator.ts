import { TheThing } from './the-thing';
import { extend } from 'lodash';
import { YGGError } from '@ygg/shared/infra/error';
import { TheThingCellDefine } from './cell-define';

export class TheThingValidateError extends YGGError {
  constructor(message: string, data: any) {
    super(5478978, message, data);
  }
}

export abstract class TheThingValidator {
  abstract validate(theThing: TheThing): TheThingValidateError[];
}

export class TheThingValidatorBasic extends TheThingValidator {
  requiredCells: TheThingCellDefine[] = [];

  constructor(options: any = {}) {
    super();
    extend(this, options);
  }

  validate(theThing: TheThing): TheThingValidateError[] {
    const errors: TheThingValidateError[] = [];
    if (!theThing) {
      errors.push(
        new TheThingValidateError('TheThing undefined or NULL', { theThing })
      );
    } else {
      for (const cell of this.requiredCells) {
        if (!theThing.hasCell(cell.name, cell.type)) {
          errors.push(new TheThingValidateError(`缺少資料欄位：${cell.name}, 資料類型：${cell.type}`, { requiredCell: cell }))
        }
      }
    }
    return errors;
  }
}
