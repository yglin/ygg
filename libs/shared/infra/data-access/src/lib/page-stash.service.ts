import { isEmpty, every } from 'lodash';
import { Injectable, Inject } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

export class PageStashPromise {
  resolved = false;
  data: any;

  constructor(data: any) {
    this.data = data;
  }
}

interface PageData {
  path: string;
  data: any;
  promises?: { [name: string]: PageStashPromise };
}

@Injectable({
  providedIn: 'root'
})
export class PageStashService {
  storageKey = 'page-stash';

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {}

  push(pageData: PageData) {
    let pageStash = this.storage.get(this.storageKey);
    pageStash = pageStash || [];
    pageStash.push(pageData);
    this.storage.set(this.storageKey, pageStash);
  }

  pop(): PageData {
    let pageStash = this.storage.get(this.storageKey);
    pageStash = pageStash || [];
    const pageData = pageStash.pop();
    this.storage.set(this.storageKey, pageStash);
    return pageData;
  }

  peepTop(): PageData {
    let pageStash = this.storage.get(this.storageKey);
    pageStash = pageStash || [];
    const pageData = pageStash.pop();
    return pageData;
  }

  isMatchPageResolved(routePath: string): boolean {
    const pageData = this.peepTop();
    if (!pageData || pageData.path !== routePath) {
      return false;
    } else if (isEmpty(pageData.promises)) {
      return true;
    } else {
      return every(pageData.promises, promise => promise.resolved);
    }
  }
}
