import { Injectable } from '@angular/core';
import { TheThingMapFinder } from '@ygg/the-thing/core';
import { LocationRecordAccessService } from './location-record-access.service';

@Injectable({
  providedIn: 'root'
})
export class TheThingMapFinderService extends TheThingMapFinder {
  constructor(locationRecordAccessor: LocationRecordAccessService) {
    super(locationRecordAccessor);
  }
}
