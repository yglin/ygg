import {Injectable} from '@angular/core';
import {DataAccessService} from '@ygg/shared/infra/data-access';
import {find, isEmpty, range} from 'lodash';
import {combineLatest, Observable, of} from 'rxjs';

import {Resource} from './models';

@Injectable({providedIn: 'root'})
export class ResourceService {
  collection = 'resources';

  constructor(private dataAccessService: DataAccessService) {}

  list$(): Observable<Resource[]> {
    return this.dataAccessService.list$(this.collection, Resource);
  }

  get$(id: string): Observable<Resource> {
    return this.dataAccessService.get$(this.collection, id, Resource);
  }

  getByIds$(ids: string[]): Observable<Resource[]> {
    return this.dataAccessService.getByIds$(this.collection, ids, Resource);
  }

  forgeOne(): Resource {
    const newResource = new Resource();
    return newResource;
  }
}
