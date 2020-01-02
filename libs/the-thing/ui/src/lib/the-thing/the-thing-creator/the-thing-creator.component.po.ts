import { PageObject } from "@ygg/shared/test/page-object";

export class TheThingCreatorPageObject extends PageObject {
  selectors = {
    main: '.the-thing-creator',
    lastCellControl: '.cells .last-cell'
  }
}