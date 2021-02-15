import {
  Album,
  Location,
  OmniTypeID,
  OmniTypes
} from '@ygg/shared/omni-types/core';
import {
  AlbumControlPageObjectCypress,
  LocationControlPageObjectCypress,
  OmniTypeControlPageObjectCypress
} from '@ygg/shared/omni-types/test';
import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { ControlPageObject } from '@ygg/shared/test/page-object';
import { TextControlPageObjectCypress } from 'libs/shared/omni-types/test/src/lib/text';

export class TreasureEditPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.treasure-edit',
    'album-control': '.album.control',
    'name-control': '.name.control',
    'location-control': '.location.control'
  };

  controlPOs: {
    [controlName: string]: {
      type: OmniTypeID;
      pageObject: ControlPageObject;
    };
  } = {};

  constructor(parentSelector?: string) {
    super(parentSelector);
    this.controlPOs = {
      album: {
        type: OmniTypes.album.id,
        pageObject: new AlbumControlPageObjectCypress(
          this.getSelector('album-control')
        )
      },
      name: {
        type: OmniTypes.text.id,
        pageObject: new TextControlPageObjectCypress(
          this.getSelector('name-control')
        )
      },
      location: {
        type: OmniTypes.location.id,
        pageObject: new LocationControlPageObjectCypress(
          this.getSelector('location-control')
        )
      }
    };
  }

  expectHint(controlName: string, hintMessage: string) {
    const controlPO = this.controlPOs[controlName].pageObject;
    controlPO.expectHint(hintMessage);
  }

  setValue(controlName: string, value: any) {
    const controlPO = this.controlPOs[controlName].pageObject;
    controlPO.setValue(value);
  }

  nextStep() {
    cy.get('.next-step:visible')
      .scrollIntoView()
      .click();
  }

  submit() {
    cy.get('button.submit').scrollIntoView().click();
  }
}
