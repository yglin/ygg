import { ControlPageObject, Tester } from "@ygg/shared/infra/test-utils";
import { AddressControlComponentPageObject } from '../address/index.po';
import { GeoPointControlComponentPageObject } from '../geo-point/index.po';
import { Location } from '../location';

export class LocationControlComponentPageObject extends ControlPageObject<Location> {
  selector = '.location-control';
  selectors = {
    label: '.label',
    sliderToggleSync: '#sync-mode input[type="checkbox"]',
    buttonNextGeoPoint: 'button#next-geo-point'
  };

  addressControl: AddressControlComponentPageObject;
  geoPointControl: GeoPointControlComponentPageObject;

  constructor(tester: Tester, parentSelector: string = '') {
    super(tester, parentSelector);
    this.addressControl = new AddressControlComponentPageObject(tester, this.getSelector());
    this.geoPointControl = new GeoPointControlComponentPageObject(tester, this.getSelector());
  }

  getLabel(): string {
    return this.tester.getTextContent(this.getSelector('label'));
  }

  toNextGeoPoint() {
    const buttonNext: HTMLButtonElement = this.getElement('buttonNextGeoPoint');
    buttonNext.click();
  }

  setSyncMode(value: boolean) {
    this.tester.slideToggle(this.getSelector('sliderToggleSync'), value);
  }

  setValue(value: Location) {
    if (Location.isLocation(value)) {
      if (value.address) {
        this.addressControl.setValue(value.address);
      }
      if (value.geoPoint) {
        this.geoPointControl.setValue(value.geoPoint);
      }
    }
  }
}