import { PageObject } from '@ygg/shared/test/page-object';
import { GeoPoint } from '@ygg/shared/omni-types/core';

export abstract class GeoPointControlPageObject extends PageObject {
  selectors = {
    main: '.geo-point-control',
    inputLatitude: 'input#latitude',
    inputLongitude: 'input#longitude'
  };

  abstract setValue(geoPoint: GeoPoint): void;
}
