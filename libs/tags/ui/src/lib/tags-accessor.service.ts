import { Injectable } from '@angular/core';
import { TagsAccessor } from '@ygg/tags/core';
import { FireStoreAccessService } from '@ygg/shared/infra/data-access';

@Injectable({
  providedIn: 'root'
})
export class TagsAccessorService extends TagsAccessor {
  constructor(dataAccessor: FireStoreAccessService) {
    super(dataAccessor);
  }
}
