import { PageObject } from '@ygg/shared/test/page-object';
import { Contact } from '@ygg/shared/omni-types/core';

export abstract class ContactViewPageObject extends PageObject {
  selectors = {
    main: '.ygg-contact-view',
    name: '.name .field-value',
    phone: '.phone .field-value',
    email: '.email .field-value',
    lineID: '.lineID .field-value'
  };

  abstract expectValue(value: Contact): any;
}
