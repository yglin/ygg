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
      for (const cellDef of this.requiredCells) {
        if (!theThing.hasCell(cellDef.id, cellDef.type)) {
          errors.push(
            new TheThingValidateError(
              `缺少資料欄位：${cellDef.label}, 資料類型：${cellDef.type}`,
              { requiredCell: cellDef }
            )
          );
        } else {
          const cell = theThing.getCell(cellDef.id);
          if (cell.value !== 0 && !cell.value) {
            errors.push(
              new TheThingValidateError(`資料欄位 ${cell.label} 必須有值`, {
                requiredCell: cell
              })
            );
          }
        }
      }
    }
    return errors;
  }
}
