import { ViewPageObject } from "@ygg/shared/infra/test-utils";
import { GeoPoint } from '../geo-point';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'agm-map',
  template: '',
  styles: ['']
})
export class MockAgmMapComponent {
  @Input() latitude: number;
  @Input() longitude: number;
  @Input() zoom: number;
}

@Component({
  selector: 'agm-marker',
  template: '',
  styles: ['']
})
export class MockAgmMarkerComponent {
  @Input() latitude: number;
  @Input() longitude: number;
}


export class GeoPointViewComponentPageObject extends ViewPageObject<GeoPoint> {
  selector = '.geo-point-view'
  selectors = {
    coordinates: '.coordinates'
  };

  expectValue(geoPoint: GeoPoint) {
    this.tester.expectTextContent(this.getSelector('coordinates'), `${geoPoint.latitude}, ${geoPoint.longitude}`);
  }
}

