import { Injectable } from '@angular/core';
import { BoxFinder } from '@ygg/ourbox/core';
import { MapFinderService } from '@ygg/shared/geography/ui';
import { FireStoreAccessService } from '@ygg/shared/infra/data-access';
import { TreasureFinderService } from '../treasure/treasure-finder.service';
import { BoxFactoryService } from './box-factory.service';

@Injectable({
  providedIn: 'root'
})
export class BoxFinderService extends BoxFinder {
  constructor(
    dataAccessor: FireStoreAccessService,
    boxFactory: BoxFactoryService,
    treasureFinder: TreasureFinderService,
    mapFinder: MapFinderService
  ) {
    super(dataAccessor, boxFactory, treasureFinder, mapFinder);
  }
}
