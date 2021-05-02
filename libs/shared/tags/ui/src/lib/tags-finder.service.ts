import { Injectable } from '@angular/core';
import { FireStoreAccessService } from '@ygg/shared/infra/data-access';
import { TagsFinder } from '@ygg/shared/tags/core';

@Injectable({
  providedIn: 'root'
})
export class TagsFinderService extends TagsFinder {
  constructor(dataAccessor: FireStoreAccessService) {
    super(dataAccessor);
  }
}
