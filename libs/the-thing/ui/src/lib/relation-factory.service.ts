import { Injectable } from '@angular/core';
import { RelationFactory } from '@ygg/the-thing/core';
import { FireStoreAccessService } from '@ygg/shared/infra/data-access';
import { RelationAccessService } from './relation-access.service';

@Injectable({
  providedIn: 'root'
})
export class RelationFactoryService extends RelationFactory {
  constructor(relationAccessor: RelationAccessService) {
    super(relationAccessor);
  }
}
