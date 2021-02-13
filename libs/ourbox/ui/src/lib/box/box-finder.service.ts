import { Injectable } from '@angular/core';
import { BoxFinder } from '@ygg/ourbox/core';
import { FireStoreAccessService } from '@ygg/shared/infra/data-access';
import { BoxFactoryService } from './box-factory.service';

@Injectable({
  providedIn: 'root'
})
export class BoxFinderService extends BoxFinder {
  constructor(
    dataAccessor: FireStoreAccessService,
    boxFactory: BoxFactoryService
  ) {
    super(dataAccessor, boxFactory);
  }
}
