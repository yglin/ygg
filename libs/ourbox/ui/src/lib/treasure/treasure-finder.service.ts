import { Injectable } from '@angular/core';
import { TreasureFinder } from '@ygg/ourbox/core';
import { FireStoreAccessService } from '@ygg/shared/infra/data-access';
import { TreasureFactoryService } from './treasure-factory.service';

@Injectable({
  providedIn: 'root'
})
export class TreasureFinderService extends TreasureFinder {
  constructor(
    dataAccessor: FireStoreAccessService,
    treasureFactory: TreasureFactoryService
  ) {
    super(dataAccessor, treasureFactory);
  }
}
