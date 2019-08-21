import { Tester, TesterConfig } from "../tester";
import { DebugElement } from "@angular/core";
import { By } from '@angular/platform-browser';

export interface AngularJestTesterConfig extends TesterConfig {
  debugElement: DebugElement
};

export class AngularJestTester extends Tester {
  config: AngularJestTesterConfig;

  getTextContent(selector: string) {
    const nativeElement: HTMLElement = this.config.debugElement.query(
      By.css(selector)
    ).nativeElement;
    return nativeElement.textContent;
  }

  getAttribute(selector: string, attributeName: string): string {
    const nativeElement: HTMLElement = this.config.debugElement.query(
      By.css(selector)
    ).nativeElement;
    return nativeElement.getAttribute(attributeName);
  }

  inputText(selector: string, value: string) {
    const nativeElement: HTMLInputElement = this.config.debugElement.query(
      By.css(selector)
    ).nativeElement;
    nativeElement.value = value;
    nativeElement.dispatchEvent(new Event('input'));
  }
  
  inputNumber(selector: string, value: number) {
    const nativeElement: HTMLInputElement = this.config.debugElement.query(
      By.css(selector)
    ).nativeElement;
    nativeElement.value = value.toString();
    nativeElement.dispatchEvent(new Event('input'));
  }
}