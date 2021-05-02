import { EntityAccessor, toJSONDeep } from '@ygg/shared/infra/core';
import { LocationRecord } from './location-record';

export abstract class LocationRecordAccessor extends EntityAccessor<
  LocationRecord
> {
  collection = LocationRecord.collection;
  serializer = (locationRecord: LocationRecord): any =>
    toJSONDeep(locationRecord);
  deserializer = (data: any): LocationRecord => new LocationRecord(data);
}
