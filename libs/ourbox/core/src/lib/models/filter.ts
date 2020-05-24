import { TheThingFilter } from '@ygg/the-thing/core';
import { Item } from './item';
import { GeoPoint } from '@ygg/shared/omni-types/core';
import * as leaflet from 'leaflet';
import { CellNames } from './cell-names';

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

  test(item: Item): boolean {
    if (!super.test(item)) {
      return false;
    }
    const location = item.getCellValue(CellNames.location);
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
