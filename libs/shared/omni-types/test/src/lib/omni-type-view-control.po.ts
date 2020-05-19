import { OmniTypeViewControlPageObject } from '@ygg/shared/omni-types/ui';
import { OmniTypeID } from '@ygg/shared/omni-types/core';
import { YggDialogPageObjectCypress } from '@ygg/shared/ui/test';
import { OmniTypeControlPageObjectCypress } from './omni-type-control.po';
import { OmniTypeViewPageObjectCypress } from './omni-type-view.po';

export class OmniTypeViewControlPageObjectCypress extends OmniTypeViewControlPageObject {
  openControl() {
    cy.get(this.getSelector('buttonEdit')).click();
  }

  setValue(type: OmniTypeID, value: any) {
    this.openControl();
    const dialogPO = new YggDialogPageObjectCypress();
    dialogPO.expectVisible();
    const controlPO = new OmniTypeControlPageObjectCypress(
      dialogPO.getSelector()
    );
    controlPO.setValue(type, value);
    dialogPO.confirm();
    // dialogPO.expectClosed();
    this.expectValue(type, value);
  }

  expectValue(type: OmniTypeID, value: any) {
    const viewPO = new OmniTypeViewPageObjectCypress(this.getSelector());
    viewPO.expectValue(type, value);
  }
}
