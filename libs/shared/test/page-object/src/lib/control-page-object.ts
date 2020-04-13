import { PageObject } from './page-object';

export abstract class ControlPageObject extends PageObject {
  abstract setValue(value: any): void;
}
