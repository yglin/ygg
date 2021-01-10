import { Contact } from '@ygg/shared/omni-types/core';
import { ControlPageObject } from '@ygg/shared/test/page-object';

export abstract class ContactControlPageObject extends ControlPageObject {
  selectors = {
    main: 'ygg-contact-control',
    inputName: 'input#name',
    inputPhone: 'input#phone',
    inputEmail: 'input#email',
    inputLineID: 'input#lineID',
    buttonImportFromUser: 'button.import-from-user'
  };

  abstract setValue(contact: Contact): void;
  abstract expectValue(contact: Contact): void;
}
