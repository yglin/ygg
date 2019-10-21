import * as moment from 'moment';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture } from '@angular/core/testing';

export interface AngularJestTesterConfig {
  fixture: ComponentFixture<any>;
  debugElement: DebugElement;
}

export class AngularJestTester {
  fixture: ComponentFixture<any>;
  debugElement: DebugElement;

  constructor(config: AngularJestTesterConfig) {
    this.fixture = config.fixture;
    this.debugElement = config.debugElement;
  }

  stubConfirm() {
    window.confirm = jest.fn(() => true);
  }

  stubAlert() {
    window.alert = jest.fn(() => {});
  }

  getDebugElement(selector: string): DebugElement {
    // console.log(`Query by selector: "${selector}"`);
    const debugElement = this.debugElement.query(By.css(selector));
    if (!debugElement) {
      const errorMessage = `Can not find element by selector: ${selector}`;
      console.warn(errorMessage);
      throw new Error(errorMessage);
    }
    return debugElement
  }

  getNativeElement<T>(selector: string): T {
    const debugElement = this.getDebugElement(selector);
    return debugElement.nativeElement as T;
  }

  countElements(selector: string): number {
    return this.debugElement.queryAll(By.css(selector)).length;
  }

  expectExist(selector: string, flag: boolean) {
    const debugElement = this.getDebugElement(selector);
    if (flag) {
      expect(debugElement).toBeTruthy();
    } else {
      expect(debugElement).toBeFalsy();
    }
  }

  expectVisible(selector: string, flag: boolean) {
    let isHidden: boolean;
    let debugElement: DebugElement;
    try {
      debugElement = this.getDebugElement(selector)
      if (debugElement) {
        const nativeElement: HTMLElement = debugElement.nativeElement;
        isHidden = nativeElement.attributes['hidden'] !== undefined && nativeElement.attributes['hidden'] !== false;
      } else {
        isHidden = true;
      }
    } catch (error) {
      isHidden = true;
    }
    expect(isHidden).toEqual(!flag);
  }

  expectDisabled(selector: string, flag: boolean) {
    const element = this.getNativeElement<HTMLButtonElement>(selector);
    if (flag) {
      expect(element.disabled).not.toBeFalsy();      
    } else {
      expect(element.disabled).toBeFalsy();
    }
  }

  expectInputValue(selector: string, value: any) {
    const inputElement: HTMLInputElement = this.getNativeElement<HTMLInputElement>(selector);
    // console.log(typeof inputElement.value);
    expect(inputElement.value).toEqual(value);
  }

  expectTextIncluded(selector: string, text: string) {
    expect(this.getNativeElement<HTMLElement>(selector).innerHTML).toContain(text);
  }

  async expectTextContent(selector: string, text: string) {
    expect(this.getNativeElement<HTMLElement>(selector).textContent).toEqual(text);
  }

  async click(selector: string) {
    this.getNativeElement<HTMLElement>(selector).click();
    await this.fixture.whenStable();
    this.fixture.detectChanges();
    return Promise.resolve();
  }

  async inputText(selector: string, text: string) {
    const input = this.getNativeElement<HTMLInputElement>(selector);
    input.value = text;
    input.dispatchEvent(new Event('input'));
    await this.fixture.whenStable();
    this.fixture.detectChanges();
    return Promise.resolve();
  }

  async inputDate(selector: string, date: Date) {
    const input = this.getNativeElement<HTMLInputElement>(selector);
    input.value = moment(date).format('M/D/YYYY');
    input.dispatchEvent(new Event('input'));
    await this.fixture.whenStable();
    this.fixture.detectChanges();
    return Promise.resolve();
  }

  async type(selector: string, letter: string) {
    const input = this.getNativeElement<HTMLInputElement>(selector);
    input.value += letter;
    input.dispatchEvent(new KeyboardEvent('keyup', { key: letter}));
    input.dispatchEvent(new Event('change'));
    await this.fixture.whenStable();
    this.fixture.detectChanges();
    return Promise.resolve();
  }

  async inputSelect(selector: string, optionValue: any) {
    const input = this.getNativeElement<HTMLSelectElement>(selector);
    input.value = optionValue;
    input.dispatchEvent(new Event('change'));
    await this.fixture.whenStable();
    this.fixture.detectChanges();
    return Promise.resolve();
  }
}