import { Injectable } from '@angular/core';
import { FormGroupModel, Tags, FormControlType, BusinessHours, Album, FormControlModel, Location, FormFactoryService } from "@ygg/shared/types";
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
// import { Play } from "./play";
import { PlayTagService, PlayTag } from '../tag';
import { Play } from './play';

@Injectable({
  providedIn: 'root'
})
export class PlayFactoryService {

  constructor(
    private formFactoryService: FormFactoryService,
    private playTagsService: PlayTagService) { }

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
