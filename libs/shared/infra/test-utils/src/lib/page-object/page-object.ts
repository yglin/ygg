export type InputMethod = (
  selector: string,
  value: any,
  ...args: any[]
) => void;

export interface InputMethodsCollection {
  [methodName: string]: InputMethod;
}

export abstract class PageObject {
  parentSelector: string = '';
  selector: string = '';
  selectors: { [index: string]: string } = {};

  constructor(parentSelector: string = '') {
    this.parentSelector = parentSelector;
  }

  getSelector(name?: string): string {
    const targetSelector =
      name && name in this.selectors ? this.selectors[name] : '';
    return `${this.parentSelector} ${this.selector} ${targetSelector}`.trim();
  }
}

/**
 * This class provides a generic page-objects which behave as form controls,
 * that is, they must support setInput methods for tester.
 * 
 * To have it work independent of different test frameworks, ex: jest, cypress... 
 * ,you have to implement different set of input methods against each test framwork,
 * and pass them as InputMethodsCollection to the constructor
 */
export abstract class ControlPageObject<T> extends PageObject {
  inputMethods: InputMethodsCollection;

  constructor(
    parentSelector: string = '',
    inputMethods: InputMethodsCollection
  ) {
    super(parentSelector);
    this.inputMethods = inputMethods;
  }

  /**
   * This function provides a generic interface for input value,
   * regardless of different test frameworks, ex: jest, cypress... .
   *
   * @param value Value for input
   * @param options Configs to be passed to input methods
   */
  abstract setInput(value: T, options: any): void;
}
