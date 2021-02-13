import { Injectable } from '@angular/core';
import { BoxFactory } from '@ygg/ourbox/core';
import { FireStoreAccessService } from '@ygg/shared/infra/data-access';

@Injectable({
  providedIn: 'root'
})
export class BoxFactoryService extends BoxFactory {
  constructor(dataAccessor: FireStoreAccessService) {
    super(dataAccessor);
  }
}
