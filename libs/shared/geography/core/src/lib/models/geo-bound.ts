import { extend } from 'lodash';
import { GeoPoint } from './geo-point';

export class GeoBound {
  east: number;
  west: number;
  north: number;
  south: number;

  constructor(options: {
    east: number;
    west: number;
    north: number;
    south: number;
  }) {
    extend(this, options);
  }

  static fromGeoPoint(gp: GeoPoint, offsets: number[]) {
    return new GeoBound({
      east: gp.longitude + offsets[1],
      west: gp.longitude - offsets[1],
      north: gp.latitude + offsets[0],
      south: gp.latitude - offsets[0]
    });
  }

  contains(geoPoint: GeoPoint): boolean {
    return (
      geoPoint.latitude < this.north &&
      geoPoint.latitude > this.south &&
      geoPoint.longitude < this.east &&
      geoPoint.longitude > this.west
    );
  }
}
