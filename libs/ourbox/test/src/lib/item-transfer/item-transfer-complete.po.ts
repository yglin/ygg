import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { Location } from '@ygg/shared/omni-types/core';
import { LocationControlPageObjectCypress } from '@ygg/shared/omni-types/test';

export class ItemTransferCompletePageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.item-transfer-complete',
    hint: '.hint',
    inputLocation: '.input-location'
  };

  setLocation(location: Location) {
    const locationControlPO = new LocationControlPageObjectCypress(
      this.getSelector('inputLocation')
    );
    locationControlPO.setValue(location);
  }

  expectHint(hint: string) {
    cy.get(this.getSelector('hint')).should('include.text', hint);
  }
}
