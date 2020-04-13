import { PageObject } from './page-object';

export abstract class ViewPageObject extends PageObject {
  abstract expectValue(value: any): void;
}
