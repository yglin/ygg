import { Injectable } from '@angular/core';
import { TheThing, TheThingImitation, TheThingCell } from '@ygg/the-thing/core';
import {
  AuthenticateService,
  AuthenticateUiService
} from '@ygg/shared/user/ui';
import { take, first } from 'rxjs/operators';
import {
  TheThingImitationAccessService,
  TheThingAccessService
} from '@ygg/the-thing/data-access';
import { TheThingImitationViewInterface } from './the-thing/the-thing-imitation-view/imitation-view-interface.component';

export interface ITheThingCreateOptions {
  imitation?: string;
}

export interface ITheThingSaveOptions {
  requireOwner?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TheThingFactoryService {
  imitation: TheThingImitation;
  subjectThing: TheThing;
  subjectCells: string[];

  constructor(
    private authService: AuthenticateService,
    private authUiService: AuthenticateUiService,
    private theThingAccessService: TheThingAccessService,
    private imitationAccessServcie: TheThingImitationAccessService
  ) {}

  reset() {
    this.imitation = null;
    this.subjectThing = null;
    this.subjectCells = [];
  }

  getImitation(): TheThingImitation {
    return this.imitation;
  }

  setImitation(imitaiton: TheThingImitation) {
    this.imitation = imitaiton;
  }

  setSubjectThing(theThing: TheThing) {
    this.reset();
    this.subjectThing = theThing;
  }

  setSubjectCells(cellNames: string[]) {
    this.subjectCells = cellNames;
  }

  getSubjectCells(): TheThingCell[] {
    return this.subjectThing.getCellsByNames(this.subjectCells);
  }

  saveCells(cells: TheThingCell[]) {
    this.subjectThing.addCells(cells);
  }

  async create(options: ITheThingCreateOptions = {}): Promise<TheThing> {
    let newThing: TheThing;
    if (options.imitation) {
      this.imitation = await this.imitationAccessServcie
        .get$(options.imitation)
        .pipe(first())
        .toPromise();
    }
    if (this.imitation) {
      newThing = this.imitation.createTheThing();
    } else {
      newThing = new TheThing();
    }

    if (this.authService.currentUser) {
      newThing.ownerId = this.authService.currentUser.id;
    }
    // console.log('Create the thing~!!');
    // console.dir(newThing.toJSON());
    this.subjectThing = newThing;
    return newThing;
  }

  async save(theThing: TheThing, options: ITheThingSaveOptions = {}) {
    if (options.requireOwner && !theThing.ownerId) {
      try {
        const currentUser = await this.authUiService.requireLogin();
        theThing.ownerId = currentUser.id;
      } catch (error) {
        return Promise.reject(error);
      }
    }
    try {
      const result: TheThing = await this.theThingAccessService.upsert(
        theThing
      );
      alert(`已成功儲存${result.name}`);
      this.reset();
      return result;
    } catch (error) {
      alert(`儲存失敗，錯誤原因：${error.message}`);
      return Promise.reject(error);
    }
  }
}
