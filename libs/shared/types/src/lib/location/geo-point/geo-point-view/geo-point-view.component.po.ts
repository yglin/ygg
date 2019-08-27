import { ViewPageObject } from "@ygg/shared/infra/test-utils";
import { GeoPoint } from '../geo-point';

export class GeoPointViewComponentPageObject extends ViewPageObject<GeoPoint> {
  selector = '.geo-point-view'
  selectors = {
    coordinates: '.coordinates'
  };

  expectValue(geoPoint: GeoPoint) {
    this.tester.expectTextContent(this.getSelector('coordinates'), `${geoPoint.latitude}, ${geoPoint.longitude}`);
  }
}

