import { Injectable } from '@angular/core';
import {
  FormGroupModel,
  FormControlType,
  BusinessHours,
  Album,
  FormControlModel,
  Location,
  FormFactoryService
} from '@ygg/shared/types';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
// import { Play } from "./play";
import { Play } from './play';
import { Tags } from '@ygg/tags/core';

@Injectable({
  providedIn: 'root'
})
export class PlayFactoryService {
  constructor(private formFactoryService: FormFactoryService) {}

  createModel(): FormGroupModel {
    const playModel = Play.getFormModel();
    return playModel;
  }

  createFormGroup(): FormGroup {
    const formGroupModel = this.createModel();
    const formGroup = this.formFactoryService.buildGroup(formGroupModel);
    formGroup.addControl('tags', new FormControl(new Tags()));
    return formGroup;
  }
}
