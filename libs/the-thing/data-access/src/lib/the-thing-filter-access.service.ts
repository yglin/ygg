import { find } from 'lodash';
import { Injectable, Inject } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { TheThingFilter } from '@ygg/the-thing/core';

@Injectable({
  providedIn: 'root'
})
export class TheThingFilterAccessService {
  storageKey = 'the-thing-filters';

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {}

  listLocal(): TheThingFilter[] {
    let filters = this.storage.get(this.storageKey);
    filters = filters || [];
    filters = filters.map(f => new TheThingFilter().fromJSON(f));
    return filters;
  }

  pushLocal(filter: TheThingFilter) {
    let filters = this.storage.get(this.storageKey);
    filters = filters || [];
    if (find(filters, f => f.name === filter.name)) {
      throw new Error(`已存在相同的名稱： ${filter.name}`);
    } else {
      filters.push(filter.toJSON());
      this.storage.set(this.storageKey, filters);
    }
  }
}
