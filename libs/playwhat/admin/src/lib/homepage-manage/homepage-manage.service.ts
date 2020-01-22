import { isEmpty } from 'lodash';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TheThing } from '@ygg/the-thing/core';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import { PlaywhatAdminService } from '../playwhat-admin.service';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HomepageManageService {
  adminDataPath = 'homepage/exhibits';

  constructor(
    private theThingAccessService: TheThingAccessService,
    private playwhatAdminService: PlaywhatAdminService
  ) {}

  loadExhibitThings$(): Observable<TheThing[]> {
    return this.playwhatAdminService.getData$(this.adminDataPath).pipe(
      switchMap((ids: string[]) => {
        if (!isEmpty(ids)) {
          return this.theThingAccessService.listByIds$(ids);
        } else {
          return of([]);
        }
      })
    );
  }

  async saveExhibitThings(exhibitThings: TheThing[]) {
    return this.playwhatAdminService.setData(
      this.adminDataPath,
      exhibitThings.map(thing => thing.id)
    );
  }
}
