import { PageObject } from '@ygg/shared/test/page-object';

export abstract class ContactControlPageObject extends PageObject {
  selectors = {
    main: 'ygg-contact-control',
    inputName: 'input#name',
    inputPhone: 'input#phone',
    inputEmail: 'input#email',
    inputLineID: 'input#lineID',
  }
} 