import { PageObject } from '@ygg/shared/test/page-object';
import { GeoPoint } from '@ygg/shared/omni-types/core';

export abstract class GeoPointViewPageObject extends PageObject {
  selectors = {
    main: '.geo-point-view',
    coordinates: '.coordinates'
  };

  abstract expectValue(geoPoint: GeoPoint): void;
}
