import { Injectable } from '@angular/core';
import { ResourceType, Resource } from '@ygg/resource/core';
import { DataAccessService, Query, DataItem } from '@ygg/shared/infra/data-access';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  collection = 'resources';

  constructor(private dataAccessService: DataAccessService) { }

  listByType$<T extends Resource & DataItem>(resourceType: ResourceType): Observable<T[]> {
    const query = new Query('resourceType', '==', resourceType);
    return this.dataAccessService.find$<T>(this.collection, [query]);
  }
}
