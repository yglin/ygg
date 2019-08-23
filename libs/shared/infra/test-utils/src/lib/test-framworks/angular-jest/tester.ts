import { Tester, TesterConfig } from "../tester";
import { DebugElement } from "@angular/core";
import { By } from '@angular/platform-browser';

export interface AngularJestTesterConfig extends TesterConfig {
  debugElement: DebugElement
};

export class AngularJestTester extends Tester {
  config: AngularJestTesterConfig;

  getElement(selector: string): any {
    try {
      return this.config.debugElement.query(
        By.css(selector)
      ).nativeElement;
    } catch (error) {
      error.message = `Can not find HTMLElement by CSS selector: "${selector}"\n` + (error.message || '');
      throw error;
    }
  }

  getTextContent(selector: string) {
    const nativeElement: HTMLElement = this.getElement(selector);
    return nativeElement.textContent;
  }

  expectTextContent(selector: string, text: string) {
    expect(this.getTextContent(selector)).toEqual(text);
  }

  getAttribute(selector: string, attributeName: string): string {
    const nativeElement: HTMLElement = this.getElement(selector);
    return nativeElement.getAttribute(attributeName);
  }

  inputText(selector: string, value: string) {
    const nativeElement: HTMLInputElement = this.getElement(selector);
    nativeElement.value = value;
    nativeElement.dispatchEvent(new Event('input'));
  }
  
  inputNumber(selector: string, value: number) {
    const nativeElement: HTMLInputElement = this.getElement(selector);
    nativeElement.value = value.toString();
    nativeElement.dispatchEvent(new Event('input'));
  }

  slideToggle(selector: string, value: boolean, ...args: any[]) {
    const nativeElement: HTMLInputElement = this.getElement(selector);
    // console.log(`Find slideToggle by "${selector}"`);
    nativeElement.checked = value;
    nativeElement.dispatchEvent(new Event('change'));
  }
}