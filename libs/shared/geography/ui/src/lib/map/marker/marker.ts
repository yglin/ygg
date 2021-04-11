import { GeoPoint, Located } from '@ygg/shared/geography/core';
import { extend } from 'lodash';

export class Marker {
  geoPoint: GeoPoint;
  name: string;
  imgUrl: string;
  id: string;
  item: Located;

  constructor(options: any = {}) {
    extend(this, options);
  }

  static fromItem(item: Located): Marker {
    return new Marker({
      item,
      id: item.id,
      name: item.name,
      imgUrl: item.image,
      geoPoint: item.location.geoPoint
    });
  }
}
