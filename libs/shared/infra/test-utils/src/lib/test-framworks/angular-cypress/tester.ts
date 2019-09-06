import { Tester, TesterConfig } from "../tester";

export interface AngularCypressTesterConfig extends TesterConfig {
};

export class AngularCypressTester extends Tester {
  config: AngularCypressTesterConfig;

  getElement(selector: string): any {
    return cy.get(selector);
  }

  getTextContent(selector: string) {
    return this.getElement(selector).invoke('text');
  }

  getAttribute(selector: string, attributeName: string): string {
    return this.getElement(selector).invoke('attr', attributeName);
  }

  expectVisible(selector: string, flag: boolean) {
    const testVisible: string = flag ? 'be.visible' : 'not.be.visible';
    this.getElement(selector).should(testVisible);
  }

  expectTextContent(selector: string, text: string) {
    this.getTextContent(selector).should('equal', text);
  }

  inputText(selector: string, value: string) {
    this.getElement(selector).clear();
    this.getElement(selector).type(value);
  }

  clearInput(selector: string) {
    this.getElement(selector).clear();
  }
  
  inputNumber(selector: string, value: number) {
    this.getElement(selector).clear();
    this.getElement(selector).type(value);
  }

  slideToggle(selector: string, value: boolean, ...args: any[]) {
    this.getElement(selector).check(value);
  }

  clickButton(selector: string) {
    this.getElement(selector).click();
  }

  pressKey(selector: string, key: string) {
    this.getElement(selector).trigger('keypress', { key });
  }

  typeInput(selector: string, letter: string) {
    this.getElement(selector).type(letter);
  }

  iterate<T>(array: Array<T>, iteratorFn: (value: T, index: number, array: Array<T>) => any) {
    cy.wrap(array).each(iteratorFn);
  }

  async wait() {
  }

  log(message: string) {
    cy.log(message);
  }
}