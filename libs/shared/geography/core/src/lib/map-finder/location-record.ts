import { extend } from 'lodash';
import { Address } from '../location';

export class LocationRecord {
  latitude: number;
  longitude: number;
  address?: Address;
  objectCollection: string;
  objectId: string;

  get id() {
    return `${this.objectCollection}_${this.objectId}`;
  }

  constructor(options: {
    latitude: number;
    longitude: number;
    address?: Address;
    objectCollection: string;
    objectId: string;
  }) {
    extend(this, options);
    // this.id = LocationRecord.constructId(
    //   this.latitude,
    //   this.longitude,
    //   this.objectCollection,
    //   this.objectId
    // );
  }

  // static constructId(
  //   latitude: number,
  //   longitude: number,
  //   objectCollection: string,
  //   objectId: string
  // ): string {
  //   return `${objectCollection}_${objectId}_${latitude
  //     .toString()
  //     .replace(/\./g, 'p')}_${longitude.toString().replace(/\./g, 'p')}`;
  // }
}
