import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";

export function isDisabled(debugElement: DebugElement, selector: string): boolean {
  const nativeElement: any = debugElement.query(By.css(selector)).nativeElement;
  return !!(nativeElement.disabled);
}

export function typeIn(debugElement: DebugElement, selector: string, text: string) {
  const nativeElement: HTMLInputElement = debugElement.query(By.css(selector)).nativeElement;
  nativeElement.value = text;
  nativeElement.dispatchEvent(new Event('input'));
}