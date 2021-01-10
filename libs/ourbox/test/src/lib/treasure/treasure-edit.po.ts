import {
  Album,
  Location,
  OmniTypeID,
  OmniTypes
} from '@ygg/shared/omni-types/core';
import { OmniTypeControlPageObjectCypress } from '@ygg/shared/omni-types/test';
import { PageObjectCypress } from '@ygg/shared/test/cypress';

export class TreasureEditPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.treasure-edit',
    'album-control': '.album.control',
    'name-control': '.name.control',
    'location-control': '.location.control',
  };

  controlPOs: {
    [controlName: string]: {
      type: OmniTypeID;
      pageObject: OmniTypeControlPageObjectCypress;
    };
  } = {};

  constructor(parentSelector?: string) {
    super(parentSelector);
    this.controlPOs = {
      album: {
        type: OmniTypes.album.id,
        pageObject: new OmniTypeControlPageObjectCypress(
          this.getSelector('album-control'), OmniTypes.album.id
        )
      },
      name: {
        type: OmniTypes.text.id,
        pageObject: new OmniTypeControlPageObjectCypress(
          this.getSelector('name-control'), OmniTypes.text.id
        )
      },
      location: {
        type: OmniTypes.location.id,
        pageObject: new OmniTypeControlPageObjectCypress(
          this.getSelector('location-control'), OmniTypes.location.id
        )
      }
    };
  }

  expectHint(controlName: string, hintMessage: string) {
    const controlPO = this.controlPOs[controlName].pageObject;
    controlPO.expectHint(hintMessage);
  }

  setControlValue(controlName: string) {}

  setAlbum(album: Album) {
    const omniTypeControlPO = new OmniTypeControlPageObjectCypress(
      this.getSelector('.album.control')
    );
    omniTypeControlPO.setValue(OmniTypes.album.id, album);
  }

  nextStep() {
    cy.get('.next-step:visible').click();
  }

  setName(name: string) {
    const omniTypeControlPO = new OmniTypeControlPageObjectCypress(
      this.getSelector('.name.control')
    );
    omniTypeControlPO.setValue(OmniTypes.text.id, name);
  }

  setLocation(location: Location) {
    const omniTypeControlPO = new OmniTypeControlPageObjectCypress(
      this.getSelector('.location.control')
    );
    omniTypeControlPO.setValue(OmniTypes.location.id, location);
  }
}
