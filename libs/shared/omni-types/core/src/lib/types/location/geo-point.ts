/// <reference types="@types/googlemaps" />
import { random } from 'lodash';
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

  static fromLatLng(latitude: number, longitude: number): GeoPoint {
    return new GeoPoint().fromJSON({
      latitude,
      longitude
    });
  }

  static fromGoogleMapsLatLng(
    latLng: google.maps.LatLngLiteral | google.maps.LatLng
  ): GeoPoint {
    return new GeoPoint().fromJSON({
      latitude: typeof latLng.lat === 'function' ? latLng.lat() : latLng.lat,
      longitude: typeof latLng.lng === 'function' ? latLng.lng() : latLng.lng
    });
  }

  static forge(): GeoPoint {
    return GeoPoint.fromLatLng(
      random(21.9, 25.28, true),
      random(119.5, 122.0, true)
    );
  }

  constructor(options?: { latitude: number; longitude: number }) {
    this._latitude = 23.6978;
    this._longitude = 120.9605;
    if (options) {
      this.fromJSON(options);
    }
  }

  fromJSON(data: any = {}): this {
    if (GeoPoint.isGeoPoint(data)) {
      this._latitude = Math.round(data.latitude * 100000) / 100000;
      this._longitude = Math.round(data.longitude * 100000) / 100000;
    }
    return this;
  }

  toJSON(): any {
    return {
      latitude: this.latitude,
      longitude: this.longitude
    };
  }

  toGoogleMapsLatLng(): google.maps.LatLngLiteral {
    return { lat: this.latitude, lng: this.longitude };
  }
}
