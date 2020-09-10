import { Injectable, Inject } from '@angular/core';
import { LocalProfiler } from '@ygg/shared/infra/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

@Injectable({
  providedIn: 'root'
})
export class LocalProfileService extends LocalProfiler {
  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {
    super();
  }

  isFirstVisit(): boolean {
    const visited = this.storage.get('site-visited');
    if (visited) {
      return false;
    } else {
      this.storage.set('site-visited', true);
      return true;
    }
  }
}
