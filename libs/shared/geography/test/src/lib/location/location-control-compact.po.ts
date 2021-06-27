import { Location, Address, GeoPoint } from '@ygg/shared/geography/core';
import { ControlPageObject } from '@ygg/shared/test/page-object';
import { YggDialogPageObjectCypress } from '@ygg/shared/ui/test';
import { AddressControlPageObjectCypress } from './address';
import { GeoPointControlPageObjectCypress } from './geo-point';
import { LocationControlPageObjectCypress } from './location-control.po';

export class LocationControlCompactPageObjectCypress extends ControlPageObject {
  selectors = {
    main: '.location-control-compact',
    address: '.address',
    buttonOpenLocationControlDialog: '.open-location-control'
  };

  addressControlPO: AddressControlPageObjectCypress;
  dialogPO: YggDialogPageObjectCypress;
  locationContorlPO: LocationControlPageObjectCypress;

  constructor(parentSelector?: string) {
    super(parentSelector);
    this.addressControlPO = new AddressControlPageObjectCypress(
      this.getSelector('address')
    );
    this.dialogPO = new YggDialogPageObjectCypress();
    this.locationContorlPO = new LocationControlPageObjectCypress(
      this.dialogPO.getSelector()
    );
  }

  setValue(location: Location) {
    if (Location.isLocation(location)) {
      cy.get(this.getSelector('buttonOpenLocationControlDialog')).click();
      this.locationContorlPO.setValue(location);
      this.dialogPO.confirm();
      
    }
  }

  expectValue(location: Location) {
    if (Location.isLocation(location)) {
      cy.get(this.getSelector('buttonOpenLocationControlDialog')).click();
      this.locationContorlPO.expectValue(location);
      this.dialogPO.confirm();
    }
  }

  // expectHint(hintMessage: string) {
  //   cy.get(this.getSelector('address')).contains(hintMessage);
  // }
}
