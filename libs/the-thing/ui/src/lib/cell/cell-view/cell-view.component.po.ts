import { PageObject } from '@ygg/shared/test/page-object';
import { TheThingCell } from '@ygg/the-thing/core';
import { OmniTypeViewPageObject } from '@ygg/shared/omni-types/ui';

export abstract class TheThingCellViewPageObject extends PageObject {
  selectors = {
    main: '.the-thing-cell-view'
  };

  abstract expectValue(cell: TheThingCell): void;
}
