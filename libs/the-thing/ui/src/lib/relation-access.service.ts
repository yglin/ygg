import { Injectable } from '@angular/core';
import { RelationAccessor } from '@ygg/the-thing/core';
import { FireStoreAccessService } from '@ygg/shared/infra/data-access';

@Injectable({
  providedIn: 'root'
})
export class RelationAccessService extends RelationAccessor {
  constructor(dataAccessor: FireStoreAccessService) {
    super(dataAccessor);
  }
}
