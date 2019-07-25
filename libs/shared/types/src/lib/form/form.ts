import { isEmpty } from "lodash";
import { ValidatorModel } from './validator';

export interface FormControlModel {
  name: string;
  type: string;
  label: string;
  default?: any;
  validators?: ValidatorModel[];
}

export interface FormGroupModel {
  name: string;
  controls: { [key: string]: FormControlModel };
}

export function hasValidator(controlModel: FormControlModel, validator: ValidatorModel | string) {
  if (isEmpty(controlModel.validators)) {
    return false;
  } else {
    const targetType = typeof validator === 'string' ? validator : validator.type;
    for (const _validator of controlModel.validators) {
      if (_validator.type === targetType) {
        return true;
      }
    }
    return false;
  }
}
