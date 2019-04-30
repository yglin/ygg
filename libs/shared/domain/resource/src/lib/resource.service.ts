import { range, find } from 'lodash';
import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { Resource } from './models';
import { DataAccessService } from '@ygg/shared/data-access';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  collection = 'resources';

  constructor(
    private dataAccessService: DataAccessService
  ) { }

  list$(): Observable<Resource[]> {
    return this.dataAccessService.list$(this.collection, Resource);
  }

  get$(id: string): Observable<Resource> {
    return this.dataAccessService.get$(this.collection, id, Resource);
  }

  getByIds$(ids: string[]): Observable<Resource[]> {
    const arrayGet$: Observable<Resource>[] = ids.map(id => this.get$(id));
    return combineLatest(arrayGet$);
  }

  forgeOne(): Resource {
    const newResource = new Resource();
    return newResource;
  }
}
