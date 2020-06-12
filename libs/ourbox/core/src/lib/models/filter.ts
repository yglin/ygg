import { TheThingFilter, TheThing } from '@ygg/the-thing/core';
import { ImitationItemCells } from './item';
import { GeoPoint } from '@ygg/shared/omni-types/core';
import * as leaflet from 'leaflet';

export class GeoBound {
  leafletBound: any;

  constructor(
    options: {
      bound?: any;
    } = {}
  ) {
    this.leafletBound = options.bound;
  }

  contains(geoPoint: GeoPoint): boolean {
    const latlng = leaflet.latLng(geoPoint.latitude, geoPoint.longitude);
    return this.leafletBound.contains(latlng);
  }
}

export class ItemFilter extends TheThingFilter {
  geoBound?: GeoBound;

  setGeoBoundary(bound: GeoBound) {
    this.geoBound = bound;
  }

  test(item: TheThing): boolean {
    if (!super.test(item)) {
      return false;
    }
    const location = item.getCellValue(ImitationItemCells.location.name);
    if (
      !!this.geoBound &&
      !!location &&
      !this.geoBound.contains(location.geoPoint)
    ) {
      return false;
    }
    return true;
  }
}
