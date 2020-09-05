import { EntityAccessor, generateID, toJSONDeep } from '@ygg/shared/infra/core';
import { extend } from 'lodash';
import { Address } from '@ygg/shared/omni-types/core';

export class LocationRecord {
  id: string;
  latitude: number;
  longitude: number;
  address?: Address;
  objectCollection: string;
  objectId: string;

  static constructId(
    latitude: number,
    longitude: number,
    objectCollection: string,
    objectId: string
  ): string {
    return `${objectCollection}_${objectId}_${latitude
      .toString()
      .replace(/\./g, 'p')}_${longitude.toString().replace(/\./g, 'p')}`;
  }

  constructor(options: {
    id?: string;
    latitude: number;
    longitude: number;
    address?: Address;
    objectCollection: string;
    objectId: string;
  }) {
    extend(this, options);
    this.id = LocationRecord.constructId(
      this.latitude,
      this.longitude,
      this.objectCollection,
      this.objectId
    );
  }
}

export abstract class LocationRecordAccessor extends EntityAccessor<
  LocationRecord
> {
  collection = 'location-records';
  serializer = (locationRecord: LocationRecord): any =>
    toJSONDeep(locationRecord);
  deserializer = (data: any): LocationRecord => new LocationRecord(data);
}
