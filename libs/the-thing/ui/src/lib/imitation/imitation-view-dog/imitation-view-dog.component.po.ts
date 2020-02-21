import { PageObject } from '@ygg/shared/test/page-object';
import { TheThingCell } from '@ygg/the-thing/core';

export abstract class ImitationViewDogPageObject extends PageObject {
  selectors = {
    main:'.imitation-view-dog',
    validateErrors: '.validate-errors'
  };

  getSelectorForCell(cell: TheThingCell): string {
    return `${this.getSelector()} [cell-name="${cell.name}"]`;
  }
}