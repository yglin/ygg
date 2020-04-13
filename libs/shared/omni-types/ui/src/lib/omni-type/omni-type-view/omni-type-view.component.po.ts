import { PageObject } from '@ygg/shared/test/page-object';
import { OmniTypeID } from '@ygg/shared/omni-types/core';

export abstract class OmniTypeViewPageObject extends PageObject {
  selectors = {
    main: '.omni-type-view'
  };

  abstract expectValue(type: OmniTypeID, value: any): void;
}
