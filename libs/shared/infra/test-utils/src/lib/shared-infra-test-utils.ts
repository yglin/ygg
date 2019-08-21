import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormControlType } from '@ygg/shared/types';

export function isDisabled(
  debugElement: DebugElement,
  selector: string
): boolean {
  const nativeElement: any = debugElement.query(By.css(selector)).nativeElement;
  return !!nativeElement.disabled;
}

export function setInputText(
  debugElement: DebugElement,
  selector: string,
  text: string
) {
  const nativeElement: HTMLInputElement = debugElement.query(By.css(selector))
    .nativeElement;
  nativeElement.value = text;
  nativeElement.dispatchEvent(new Event('input'));
}

export function setInputNumber(debugElement: DebugElement, selector: string, value: number) {
  const nativeElement: HTMLInputElement = debugElement.query(By.css(selector))
    .nativeElement;
  nativeElement.value = value.toString();
  nativeElement.dispatchEvent(new Event('input'));
}

// Deprecated
// export function setInputValue(
//   debugElement: DebugElement,
//   inputType: FormControlType,
//   name: string,
//   text: string
// ) {
//   let selector: string;
//   switch (inputType) {
//     case FormControlType.text:
//       selector = `#${name} input`;
//       break;
//     case FormControlType.textarea:
//       selector = `#${name} textarea`;
//       break;

//     default:
//       break;
//   }
//   const nativeElement: HTMLInputElement = debugElement.query(By.css(selector))
//     .nativeElement;
//   nativeElement.value = text;
//   nativeElement.dispatchEvent(new Event('input'));
// }
