import { Injectable } from '@angular/core';
import {
  FormGroupModel,
  FormControlType,
  FormControlModel,
  FormFactoryService
} from '@ygg/shared/ui/dynamic-form';
import { BusinessHours, Album, Location } from "@ygg/shared/types";
import { FormGroup, FormControl } from '@angular/forms';
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
    const playModel = this.getFormGroupModel();
    return playModel;
  }

  createFormGroup(): FormGroup {
    const formGroupModel = this.createModel();
    const formGroup = this.formFactoryService.buildGroup(formGroupModel);
    formGroup.addControl('tags', new FormControl(new Tags()));
    return formGroup;
  }

  getFormGroupModel(): FormGroupModel {
    const controls: { [key: string]: FormControlModel } = {
      name: {
        name: 'name',
        type: FormControlType.text,
        label: '名稱',
        validators: [
          {
            type: 'required',
            errorMessage: '請填入名稱'
          }
        ]
      },
      introduction: {
        name: 'introduction',
        type: FormControlType.textarea,
        label: '簡介',
        validators: [
          {
            type: 'required',
            errorMessage: '請填入簡介'
          }
        ]
      },
      album: {
        name: 'album',
        type: FormControlType.album,
        label: '相簿',
        default: new Album()
      },
      businessHours: {
        name: 'businessHours',
        type: FormControlType.businessHours,
        label: '服務時段',
        default: new BusinessHours()
      },
      location: {
        name: 'location',
        type: FormControlType.location,
        label: '地點',
        default: new Location()
      }
    };

    const formModel = { name: 'play-form', controls };
    return formModel;
  }
}
