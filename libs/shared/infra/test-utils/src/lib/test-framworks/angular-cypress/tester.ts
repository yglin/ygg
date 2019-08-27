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

  expectTextContent(selector: string, text: string) {
    this.getTextContent(selector).should('equal', text);
  }

  getAttribute(selector: string, attributeName: string): string {
    return this.getElement(selector).invoke('attr', attributeName);
  }

  inputText(selector: string, value: string) {
    this.getElement(selector).clear();
    this.getElement(selector).type(value);
  }
  
  inputNumber(selector: string, value: number) {
    this.getElement(selector).clear();
    this.getElement(selector).type(value);
  }

  slideToggle(selector: string, value: boolean, ...args: any[]) {
    this.getElement(selector).check(value);
  }
}