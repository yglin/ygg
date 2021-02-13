import { Box } from '@ygg/ourbox/core';
import {
  Album,
  Location,
  OmniTypeID,
  OmniTypes
} from '@ygg/shared/omni-types/core';
import {
  AlbumControlPageObjectCypress,
  LocationControlPageObjectCypress
} from '@ygg/shared/omni-types/test';
import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { ControlPageObject } from '@ygg/shared/test/page-object';
import { TextControlPageObjectCypress } from 'libs/shared/omni-types/test/src/lib/text';

export class BoxEditPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.treasure-edit',
    'name-control': '.name.control',
    'album-control': '.album.control'
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

  create(box: Box) {
    this.setValue('name', box.name);
    this.setValue('album', box.album);
  }

  setValue(controlName: string, value: any) {
    const controlPO = this.controlPOs[controlName].pageObject;
    controlPO.setValue(value);
  }

  nextStep() {
    cy.get('.next-step:visible').click();
  }

  submit() {
    cy.get('button.submit').click();
  }
}
