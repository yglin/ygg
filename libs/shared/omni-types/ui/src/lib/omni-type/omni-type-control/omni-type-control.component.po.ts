import { PageObject } from '@ygg/shared/test/page-object';
import { OmniTypeID } from '@ygg/shared/omni-types/core';

export abstract class OmniTypeControlPageObject extends PageObject {
  selectors = {
    main: '.omni-type-control'
  };

  expectHint(hintMessage: string) {
    throw new Error('Method not implemented.');
  }

  abstract setValue(type: OmniTypeID, value: any): void;
}
