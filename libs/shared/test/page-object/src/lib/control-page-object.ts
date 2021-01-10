import { PageObject } from './page-object';

export abstract class ControlPageObject extends PageObject {
  expectHint(hintMessage: string) {
    throw new Error('Method not implemented.');
  }

  setValue(value: any) {
    throw new Error('Method not implemented.');
  }
}
