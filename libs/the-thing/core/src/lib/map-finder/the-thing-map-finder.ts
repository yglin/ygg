import { GeoBound } from '@ygg/shared/geography/core';
import { Query } from '@ygg/shared/infra/core';
import { Observable } from 'rxjs';
import { LocationRecord, LocationRecordAccessor } from './location-record';
import { map, tap } from 'rxjs/operators';

export abstract class TheThingMapFinder {
  constructor(protected locationRecordAccessor: LocationRecordAccessor) {}

  findInBound$(bound: GeoBound): Observable<LocationRecord[]> {
    const queries: Query[] = [];
    // console.log(bound);
    queries.push(new Query('latitude', '<', bound.north));
    queries.push(new Query('latitude', '>', bound.south));
    return this.locationRecordAccessor.find$(queries).pipe(
      // tap((locationRecods: LocationRecord[]) => console.log(locationRecods)),
      map((locationRecods: LocationRecord[]) => {
        return locationRecods.filter(lr => {
          return lr.longitude < bound.east && lr.longitude > bound.west;
        });
      })
      // tap((locationRecods: LocationRecord[]) => console.log(locationRecods))
    );
  }
}
