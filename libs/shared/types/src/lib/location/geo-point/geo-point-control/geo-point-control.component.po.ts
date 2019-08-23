import { ControlPageObject } from '@ygg/shared/infra/test-utils';
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


export class GeoPointControlComponentPageObject extends ControlPageObject<
  GeoPoint
> {
  selector = '.geo-point-control';
  selectors = {
    label: '.label',
    inputLatitude: 'input#latitude',
    inputLongitude: 'input#longitude'
  };

  setValue(value: GeoPoint) {
    this.tester.inputNumber(this.getSelector('inputLatitude'), value.latitude);
    this.tester.inputNumber(
      this.getSelector('inputLongitude'),
      value.longitude
    );
  }
}
