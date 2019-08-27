import { ControlPageObject } from '@ygg/shared/infra/test-utils';
import { GeoPoint } from '../geo-point';

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
