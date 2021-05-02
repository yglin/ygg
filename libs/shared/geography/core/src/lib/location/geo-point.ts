/// <reference types="@types/googlemaps" />
import { random, sample } from 'lodash';
import { SerializableJSON } from '@ygg/shared/infra/core';

export class GeoPoint implements SerializableJSON {
  private _latitude: number;
  get latitude(): number {
    return this._latitude;
  }
  private _longitude: number;
  get longitude(): number {
    return this._longitude;
  }

  constructor(options?: { latitude: number; longitude: number }) {
    this._latitude = 23.6978;
    this._longitude = 120.9605;
    if (options) {
      this.fromJSON(options);
    }
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
    const center = sample([
      [24.6794, 121.374],
      [23.8043, 120.9],
      [23.0485, 120.4926]
    ]);
    return GeoPoint.fromLatLng(
      center[0] + random(-0.6, 0.6, true),
      center[1] + random(-0.4, 0.4, true)
    );
  }

  setCoordinates(lat: number, lng: number) {
    this._latitude = lat;
    this._longitude = lng;
  }

  isEqual(that: GeoPoint): boolean {
    return this.latitude === that.latitude && this.longitude === that.longitude;
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

  toCoordsString() {
    return `${this.latitude},${this.longitude}`;
  }

  randomMove(distance: number) {
    this._latitude += (distance * (Math.random() - 0.5)) / 100000;
    this._longitude += (distance * (Math.random() - 0.5)) / 100000;
  }
}
