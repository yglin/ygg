import { Injectable } from '@angular/core';
import { FormGroupModel } from "@ygg/shared/types";
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Play } from "./play";

@Injectable({
  providedIn: 'root'
})
export class PlayFactoryService {

  constructor() { }

  createFormGroup(): FormGroup {
    const formGroupModel: FormGroupModel = Play.getFormModel();
    const controls: {[key: string]: AbstractControl} = {};
    const formGroup = new FormGroup(controls);
    for (const name in formGroupModel.controls) {
      if (formGroupModel.controls.hasOwnProperty(name)) {
        const control = new FormControl();
        controls[name] = control;
      }
    }
    return formGroup;
  }
}
