import { PageObject } from '@ygg/shared/test/page-object';

export abstract class ContactViewPageObject extends PageObject {
  selectors = {
    main: '.ygg-contact-view',
    name: '.name .field-value',
    phone: '.phone .field-value',
    email: '.email .field-value',
    lineID: '.lineID .field-value',
  }
}