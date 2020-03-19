import { Injectable } from '@angular/core';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import { DataAccessService } from '@ygg/shared/infra/data-access';
import { ApplicationState } from '@ygg/playwhat/core';
import { TheThing, TheThingFilter } from '@ygg/the-thing/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  collection = 'applications';

  constructor(private theThingAccessService: TheThingAccessService) {}

  listInApplication$(filter?: TheThingFilter): Observable<TheThing[]> {
    const flags = {};
    flags[ApplicationState.InApplication] = true;
    if (!filter) {
      filter = new TheThingFilter();
    }
    filter.addFlags(flags);
    return this.theThingAccessService.listByFilter$(filter);
  }

  async submitApplication(thing: TheThing) {
    try {
      thing.setFlag(ApplicationState.InApplication, true);
      return await this.theThingAccessService.upsert(thing);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async cancelApplication(thing: TheThing) {
    try {
      thing.setFlag(ApplicationState.InApplication, false);
      thing.setFlag(ApplicationState.Cancelled, true);
      await this.theThingAccessService.upsert(thing);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
