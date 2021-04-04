import { GeoBound } from '@ygg/shared/geography/core';
import { Query } from '@ygg/shared/infra/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocationRecord } from './location-record';
import { LocationRecordAccessor } from './location-record-accessor';

export class MapFinder {
  constructor(protected locationRecordAccessor: LocationRecordAccessor) {}

  findInBound$(bound: GeoBound): Observable<LocationRecord[]> {
    const queries: Query[] = [];
    // console.log(bound);
    queries.push(new Query('latitude', '<', bound.north));
    queries.push(new Query('latitude', '>', bound.south));
    return this.locationRecordAccessor.find$(queries).pipe(
      // tap((locationRecods: LocationRecord[]) => console.log(locationRecods)),
      map((locationRecods: LocationRecord[]) =>
        locationRecods.filter(
          lr => lr.longitude < bound.east && lr.longitude > bound.west
        )
      )
      // tap((locationRecods: LocationRecord[]) => console.log(locationRecods))
    );
  }

  async findInBound(bound: GeoBound): Promise<LocationRecord[]> {
    const queries: Query[] = [];
    // console.log(bound);
    queries.push(new Query('latitude', '<', bound.north));
    queries.push(new Query('latitude', '>', bound.south));
    const locationRecords = await this.locationRecordAccessor.find(queries);
    return locationRecords.filter(
      lr => lr.longitude < bound.east && lr.longitude > bound.west
    );
  }
}
