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

  contains(geoPoint: GeoPoint): boolean {
    return (
      geoPoint.latitude < this.north &&
      geoPoint.latitude > this.south &&
      geoPoint.longitude < this.east &&
      geoPoint.longitude > this.west
    );
  }
}
