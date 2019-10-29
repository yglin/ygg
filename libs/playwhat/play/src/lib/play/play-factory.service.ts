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
import { AuthenticateService, User } from '@ygg/shared/user';
import { take } from 'rxjs/operators';
import { LogService } from '@ygg/shared/infra/log';

@Injectable({
  providedIn: 'root'
})
export class PlayFactoryService {
  constructor(
    private formFactoryService: FormFactoryService,
    private authenticateService: AuthenticateService,
    private logService: LogService
  ) {}

  async create(): Promise<Play> {
    const play = new Play();
    let currentUser: User;
    try {
      currentUser = await this.authenticateService.currentUser$.pipe(take(1)).toPromise();
    } catch (error) {
      this.logService.warn(error.message);
    }
    if (currentUser) {
      play.creatorId = currentUser.id;
    }
    return play;
  }

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
