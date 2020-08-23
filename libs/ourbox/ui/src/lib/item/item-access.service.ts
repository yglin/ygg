import { Injectable } from '@angular/core';
import { ItemAccessor } from '@ygg/ourbox/core';
import { RelationAccessService } from '@ygg/the-thing/ui';
import { FireStoreAccessService } from '@ygg/shared/infra/data-access';

@Injectable({
  providedIn: 'root'
})
export class ItemAccessService extends ItemAccessor {
  constructor(
    relationAccessor: RelationAccessService,
    dataAccessor: FireStoreAccessService
  ) {
    super(relationAccessor, dataAccessor);
  }
}
