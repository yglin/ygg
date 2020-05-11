import { PageObject } from '@ygg/shared/test/page-object';
import { OmniTypeID } from '@ygg/shared/omni-types/core';
import { OmniTypeControlPageObject } from '../omni-type-control/omni-type-control.component.po';
import { OmniTypeViewPageObject } from '../omni-type-view/omni-type-view.component.po';
import { YggDialogPageObject } from '@ygg/shared/ui/widgets';

export interface OmniTypeViewControlValue {
  type: OmniTypeID;
  value: any;
}

export abstract class OmniTypeViewControlPageObject extends PageObject {
  selectors = {
    main: '.omni-type-view-control',
    buttonEdit: 'button.edit'
  };

  // viewPO: OmniTypeViewPageObject;
  // controlPO: OmniTypeControlPageObject;

  // constructor(type: OmniTypeID, parentSelector?: string) {
  //   super(parentSelector);
  //   this.viewPO = this.loadViewPO(type);
  //   // Put controlPO in dialog
  //   this.controlPO = this.loadControlPO(type, YggDialogPageObject.selector);
  // }

  abstract setValue(type: OmniTypeID, value: any): void;
  abstract expectValue(type: OmniTypeID, value: any): void;

  // abstract loadControlPO(
  //   type: OmniTypeID,
  //   parentSelector?: string
  // ): OmniTypeControlPageObject;
  // abstract loadViewPO(
  //   type: OmniTypeID,
  //   parentSelector?: string
  // ): OmniTypeViewPageObject;
  // abstract setValue(value: any);
  // abstract expectValue(value: any);
}
