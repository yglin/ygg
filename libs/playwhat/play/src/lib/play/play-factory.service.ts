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
    playModel.controls['tags'].options = {
      autocompleteTags: this.playTagsService.playTags$
    };
    return playModel;
  }

  createFormGroup(): FormGroup {
    const formGroupModel = this.createModel();
    return this.formFactoryService.buildGroup(formGroupModel);
  }
}
