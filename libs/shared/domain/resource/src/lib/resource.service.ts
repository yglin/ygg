import { range, find } from 'lodash';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Resource } from './models';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  // XXX: Remove, this is fake;
  resources: Resource[];

  constructor() { }

  list$(): Observable<Resource[]> {
    // TODO: implement
    if (!this.resources) {
      this.resources = range(20).map(() => this.forgeOne());
    }
    return of(this.resources);
  }

  get$(id: string): Observable<Resource> {
    // TODO: implement
    const resource = find(this.resources, r => r.id === id);
    return of(resource);
  }

  forgeOne(): Resource {
    const newResource = new Resource();
    return newResource;
  }
}
