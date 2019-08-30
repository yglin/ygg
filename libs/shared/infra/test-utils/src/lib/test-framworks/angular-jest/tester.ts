import { Tester, TesterConfig } from "../tester";
import { DebugElement } from "@angular/core";
import { By } from '@angular/platform-browser';
import { ComponentFixture } from '@angular/core/testing';

export interface AngularJestTesterConfig extends TesterConfig {
  fixture: ComponentFixture<any>;
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

  expectVisible(selector: string, flag: boolean) {
    let isHidden: boolean;
    const debugElement: DebugElement = this.config.debugElement.query(By.css(selector));
    if (!debugElement) {
      isHidden = true;
    } else {
      const nativeElement: HTMLElement = debugElement.nativeElement;
      isHidden = nativeElement.attributes['hidden'] !== undefined && nativeElement.attributes['hidden'] !== false;
    }
    expect(isHidden).toEqual(!flag);
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

  typeInput(selector: string, letter: string) {
    const nativeElement: HTMLInputElement = this.getElement(selector);
    nativeElement.value += letter;
    nativeElement.dispatchEvent(new KeyboardEvent('keyup', { key: letter}));
  }

  pressKey(selector: string, key: string) {
    const nativeElement: HTMLInputElement = this.getElement(selector);
    nativeElement.dispatchEvent(new KeyboardEvent('keypress', { key }));
  }

  dispatchEvent(selector: string, eventName: string) {
    const nativeElement: HTMLInputElement = this.getElement(selector);
    nativeElement.dispatchEvent(new Event(eventName));
  }
  
  clearInput(selector: string) {
    const nativeElement: HTMLInputElement = this.getElement(selector);
    nativeElement.value = '';
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

  clickButton(selector: string) {
    const buttonElement: HTMLButtonElement = this.getElement(selector);
    buttonElement.click();
  }

  async wait() {
    await this.config.fixture.whenStable();
    this.config.fixture.detectChanges();
  }
}