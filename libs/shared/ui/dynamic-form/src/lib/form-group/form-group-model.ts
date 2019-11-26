import { FormControlModel } from "../form-control";

export interface FormGroupValue {
  clone: () => FormGroupValue;
}

export interface FormGroupModel {
  name: string;
  controls: { [key: string]: FormControlModel };
  controlsOrder?: string[];
}

