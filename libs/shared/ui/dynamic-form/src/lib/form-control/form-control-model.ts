import { isEmpty } from "lodash";
import { ValidatorModel } from './validator';

export enum FormControlType {
  text = 'text',
  textarea = 'textarea',
  number = 'number',
  album = 'album',
  businessHours = 'businessHours',
  address = 'address',
  geoPoint = 'geoPoint',
  location = 'location',
  link = 'link'
  // tags = 'tags'
}

export interface FormControlModel {
  name: string;
  type: FormControlType;
  label: string;
  isArray?: boolean;
  default?: any;
  validators?: ValidatorModel[];
  options?: any;
}

export function isRequired(model: FormControlModel): boolean {
  return hasValidator(model, 'required');
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
