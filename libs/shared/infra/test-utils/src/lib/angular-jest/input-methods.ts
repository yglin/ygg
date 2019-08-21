import { InputMethodsCollection } from '../page-object';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

export interface InputMethodOptions {
  debugElement: DebugElement;
}

export const inputMethodsCollection: InputMethodsCollection = {};

inputMethodsCollection.text = (
  selector: string,
  text: string,
  options: InputMethodOptions
) => {
  const nativeElement: HTMLInputElement = options.debugElement.query(
    By.css(selector)
  ).nativeElement;
  nativeElement.value = text;
  nativeElement.dispatchEvent(new Event('input'));
};

inputMethodsCollection.number = (
  selector: string,
  value: number,
  options: InputMethodOptions
) => {
  const nativeElement: HTMLInputElement = options.debugElement.query(By.css(selector))
    .nativeElement;
  nativeElement.value = value.toString();
  nativeElement.dispatchEvent(new Event('input'));
};
