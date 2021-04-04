import { Injectable } from '@angular/core';
import { MapFinder } from '@ygg/shared/geography/core';
import { LocationRecordAccessService } from '../location/location-record-access.service';

@Injectable({
  providedIn: 'root'
})
export class MapFinderService extends MapFinder {
  constructor(locationRecordAccessor: LocationRecordAccessService) {
    super(locationRecordAccessor);
  }
}
