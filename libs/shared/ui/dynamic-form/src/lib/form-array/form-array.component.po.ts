import { PageObject } from "@ygg/shared/test/page-object";

export class FormArrayPageObject extends PageObject {
  selectors = {
    main: '.form-array',
    buttonClearAll: 'button.clear-all',
    buttonAdd: 'button.add'
  }

  getSelectorForControlAt(index: number): string {
    return `${this.getSelector()} [sub-control-index="${index}"]`;
  }
}