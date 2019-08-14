import { SerializableJSON, toJSONDeep } from '@ygg/shared/infra/data-access';
import { Address } from "../address";
import { GeoPoint } from '../geo-point';

export class Location implements SerializableJSON {
  private _address?: Address;
  get address(): Address {
    return this._address;
  }
  private _geoPoint?: GeoPoint;
  get geoPoint(): GeoPoint {
    return this._geoPoint;
  }

  static isLocation(location: any): location is Location {
    return !!(
      location &&
      (Address.isAddress(location.address) ||
        GeoPoint.isGeoPoint(location.geoPoint))
    );
  }

  static forge(): Location {
    const newOne = new Location().fromJSON({
      address: Address.forge(),
      geoPoint: GeoPoint.forge()
    });
    return newOne;
  }

  constructor() {
    this._address = new Address();
    this._geoPoint = new GeoPoint();
  }

  fromJSON(data: any = {}): this {
    if (Location.isLocation(data)) {
      this._address.fromJSON(data.address);
      this._geoPoint.fromJSON(data.geoPoint);
    }
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }
}
