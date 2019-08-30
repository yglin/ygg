import { extend } from 'lodash';

export interface TesterConfig {
  [name: string]: any;
}

export type InputMethod<T> = (
  selector: string,
  value: T,
  ...args: any[]
) => void;

export abstract class Tester {
  config: TesterConfig;

  constructor(config: TesterConfig) {
    this.config = config;
  }
  
  abstract getElement(selector: string): any;
  abstract getTextContent(selector: string): string;
  abstract expectVisible(selector: string, flag: boolean): void;
  abstract expectTextContent(selector: string, text: string): void;
  abstract getAttribute(selector: string, attributeName: string): string;
  abstract inputText(selector: string, value: string, ...args: any[]): void;
  abstract typeInput(selector: string, letter: string): void;
  abstract pressKey(selector: string, key: string): void
  // abstract dispatchEvent(selector: string, eventName: string): void;
  abstract inputNumber(selector: string, value: number, ...args: any[]): void;
  abstract clearInput(selector: string): void;
  abstract slideToggle(selector: string, value: boolean, ...args: any[]): void;
  abstract clickButton(selector: string): void;
  abstract async wait();

  getConfig(name: string): any {
    return this.config[name];
  }

  setConfig(arg1: string | Partial<TesterConfig>, arg2?: any) {
    if (typeof arg1 === 'string' && arg2 !== undefined) {
      this.config[arg1] = arg2;
    } else {
      extend(this.config, arg1);
    }
  }
}
