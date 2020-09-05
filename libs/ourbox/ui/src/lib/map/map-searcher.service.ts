import { Injectable } from '@angular/core';
import { MapSearcher } from '@ygg/ourbox/core';
import { BoxFactoryService } from '../box/box-factory.service';
import { TheThingMapFinderService } from '@ygg/the-thing/ui';

@Injectable({
  providedIn: 'root'
})
export class MapSearcherService extends MapSearcher {
  constructor(
    boxFactory: BoxFactoryService,
    theThingMapFinder: TheThingMapFinderService
  ) {
    super(boxFactory, theThingMapFinder);
  }
}
