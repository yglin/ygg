import { PageObject as PageObjectBase, SelectorsConfig } from '../page-object';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture } from '@angular/core/testing';

export interface PageObjectConfig {
  fixture: ComponentFixture<any>;
  debugElement: DebugElement;
}

export class PageObject<T> extends PageObjectBase {
  fixture: ComponentFixture<T>;
  debugElement: DebugElement;

  constructor(parentSelector: string, selectorConfig: SelectorsConfig, config: PageObjectConfig) {
    super(parentSelector, selectorConfig);
    this.fixture = config.fixture;
    this.debugElement = config.debugElement;
  }

  getDebugElement(elementName: string): DebugElement {
    const selector = this.getSelector(elementName);
    // console.log(`Query by selector: "${selector}"`);
    const debugElement = this.debugElement.query(By.css(selector));
    if (!debugElement) {
      const errorMessage = `Can not find element by selector: ${selector}`;
      console.warn(errorMessage);
      throw new Error(errorMessage);
    }
    return debugElement
  }

  getNativeElement<Y>(elementName: string): Y {
    const debugElement = this.getDebugElement(elementName);
    return debugElement.nativeElement as Y;
  }

  expectVisible(elementName: string, flag: boolean) {
    let isHidden: boolean;
    let debugElement: DebugElement;
    try {
      debugElement = this.getDebugElement(elementName)
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

  async expectTextContent(elementName: string, text: string) {
    expect(this.getNativeElement<HTMLElement>(elementName).textContent).toEqual(text);
  }

  async click(elementName: string) {
    this.getNativeElement<HTMLElement>(elementName).click();
    await this.fixture.whenStable();
    this.fixture.detectChanges();
    return Promise.resolve();
  }

  async inputText(elementName: string, text: string) {
    const input = this.getNativeElement<HTMLInputElement>(elementName);
    input.value = text;
    input.dispatchEvent(new Event('input'));
    await this.fixture.whenStable();
    this.fixture.detectChanges();
    return Promise.resolve();
  }

  async type(elementName: string, letter: string) {
    const input = this.getNativeElement<HTMLInputElement>(elementName);
    input.value += letter;
    input.dispatchEvent(new KeyboardEvent('keyup', { key: letter}));
    await this.fixture.whenStable();
    this.fixture.detectChanges();
    return Promise.resolve();
  }
}