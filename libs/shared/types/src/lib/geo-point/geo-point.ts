import { SerializableJSON } from '@ygg/shared/infra/data-access';

export class GeoPoint implements SerializableJSON {
  private _latitude: number;
  get latitude(): number {
    return this._latitude;
  }
  private _longitude: number;
  get longitude(): number {
    return this._longitude;
  }

  static isGeoPoint(value: any): value is GeoPoint {
    return !!(
      value &&
      typeof value.latitude === 'number' &&
      typeof value.longitude === 'number'
    );
  }

  static forge(): GeoPoint {
    const newOne = new GeoPoint().fromJSON({
      latitude: 23.9388851,
      longitude: 120.6977043
    });
    return newOne;
  }

  constructor() {}

  fromJSON(data: any = {}): this {
    if (GeoPoint.isGeoPoint(data)) {
      this._latitude = data.latitude;
      this._longitude = data.longitude;
    }
    return this;
  }

  toJSON(): any {
    return {
      latitude: this.latitude,
      longitude: this.longitude
    };
  }
}
