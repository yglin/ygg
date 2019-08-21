import { Tester } from "../test-framworks";

export abstract class PageObject {
  parentSelector: string = '';
  selector: string = '';
  selectors: { [index: string]: string } = {};
  tester: Tester

  constructor(tester: Tester, parentSelector: string = '') {
    this.tester = tester;
    this.parentSelector = parentSelector;
  }

  getSelector(name?: string): string {
    const targetSelector =
      name && name in this.selectors ? this.selectors[name] : '';
    return `${this.parentSelector} ${this.selector} ${targetSelector}`.trim();
  }

  getTextContent(name: string): string {
    return this.tester.getTextContent(this.getSelector(name));
  }
}

export abstract class ControlPageObject<T> extends PageObject {
  constructor(
    tester: Tester,
    parentSelector: string
  ) {
    super(tester, parentSelector);
  }

  abstract setValue(value: T);
}

// export abstract class ViewPageObject<T> extends PageObject {
//   constructor(
//     tester: Tester,
//     parentSelector: string
//   ) {
//     super(tester, parentSelector);
//   }

//   abstract getValue(): T;
// }
