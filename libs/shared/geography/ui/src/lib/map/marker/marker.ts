import { GeoPoint, Located } from '@ygg/shared/geography/core';
import { extend } from 'lodash';

export class Marker {
  geoPoint: GeoPoint;
  name: string;
  imgUrl: string;
  id: string;

  constructor(options: any = {}) {
    extend(this, options);
  }

  static fromItem(item: Located): Marker {
    return new Marker({
      id: item.id,
      name: item.name,
      imgUrl: item.image,
      geoPoint: item.location.geoPoint
    });
  }
}
