import { isEmpty } from "lodash";
import { ValidatorModel } from './validator';

export enum FormControlType {
  text = 'text',
  textarea = 'textarea',
  album = 'album',
  businessHours = 'businessHours'
}

export interface FormControlModel {
  name: string;
  type: FormControlType;
  label: string;
  default?: any;
  validators?: ValidatorModel[];
  options?: any;
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
