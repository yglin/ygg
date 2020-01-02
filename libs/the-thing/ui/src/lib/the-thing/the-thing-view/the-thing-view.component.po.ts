import { PageObject } from "@ygg/shared/test/page-object";
import { TheThingCell } from '@ygg/the-thing/core';

export class TheThingViewPageObject extends PageObject {
  selectors = {
    main: '.the-thing-view',
  }

  getSelectorForCell(cell: TheThingCell): string {
    return `${this.getSelector()} .cells [cell-name="${cell.name}"]`;
  }
}