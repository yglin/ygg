import { isEmpty } from 'lodash';
import { Injectable } from '@angular/core';
import { FormControlModel, FormControlType } from './form-control';
import { FormGroupModel } from './form-group';
import {
  FormGroup,
  AbstractControl,
  FormControl,
  ValidatorFn,
  Validators,
  FormBuilder
} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormFactoryService {
  constructor(private formBuilder: FormBuilder) {}

  buildGroup(formModel: FormGroupModel): FormGroup {
    const controlConfigs: { [key: string]: any } = {};
    for (const name in formModel.controls) {
      if (formModel.controls.hasOwnProperty(name)) {
        const controlModel = formModel.controls[name];
        controlConfigs[name] = this.buildControl(controlModel);
      }
    }
    const formGroup = this.formBuilder.group(controlConfigs);
    return formGroup;
  }

  buildControl(controlModel: FormControlModel): any {
    // let config: any = {};
    // set validators
    const validators: ValidatorFn[] = [];
    if (!isEmpty(controlModel.validators)) {
      for (const validator of controlModel.validators) {
        if (validator.type === 'required') {
          validators.push(Validators.required);
        }
      }
    }
    const defaultValue = controlModel.default || null;
    // const control = new FormControl(defaultValue, validators);
    let newControl: AbstractControl;
    if (isEmpty(validators)) {
      newControl = new FormControl(defaultValue);
    } else {
      newControl = new FormControl(defaultValue, validators);
    }
    if (controlModel.isArray) {
      newControl = this.formBuilder.array([newControl]);
    }
    return newControl;
  }
}
