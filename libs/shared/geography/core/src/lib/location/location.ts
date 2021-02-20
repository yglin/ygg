import { SerializableJSON } from '@ygg/shared/infra/core';
import { Address } from './address';
import { GeoPoint } from '../models';

export class Location implements SerializableJSON {
  private _address: Address;
  get address(): Address {
    return this._address;
  }

  private _geoPoint: GeoPoint;
  get geoPoint(): GeoPoint {
    return this._geoPoint;
  }

  constructor() {
    this._address = new Address();
    this._geoPoint = new GeoPoint();
  }

  static isLocation(value: any): value is Location {
    return !!(
      value &&
      (Address.isAddress(value.address) || GeoPoint.isGeoPoint(value.geoPoint))
    );
  }

  static forge(): Location {
    return new Location().fromJSON({
      address: Address.forge(),
      geoPoint: GeoPoint.forge()
    });
  }

  clone(): Location {
    return new Location().fromJSON(this.toJSON());
  }

  fromJSON(data: any = {}): this {
    if (Location.isLocation(data)) {
      if (data.address) {
        this._address = new Address().fromJSON(data.address);
      }
      if (data.geoPoint) {
        this._geoPoint = new GeoPoint().fromJSON(data.geoPoint);
      }
    }
    return this;
  }

  toJSON(): any {
    const data: any = {};
    if (Address.isAddress(this.address)) {
      data.address = this.address.toJSON();
    }
    if (GeoPoint.isGeoPoint(this.geoPoint)) {
      data.geoPoint = this.geoPoint.toJSON();
    }
    return data;
  }
}

export interface Located {
  location: Location;
}
