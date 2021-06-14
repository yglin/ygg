import { Injectable } from '@angular/core';
import { FireStoreAccessService } from '@ygg/shared/infra/data-access';
import { PostFactory } from '@ygg/shared/post/core';

@Injectable({
  providedIn: 'root'
})
export class PostFactoryService extends PostFactory {
  constructor(dataAccessor: FireStoreAccessService) {
    super(dataAccessor);
  }
}
