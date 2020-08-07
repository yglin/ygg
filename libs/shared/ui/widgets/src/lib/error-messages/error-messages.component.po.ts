import { PageObject } from '@ygg/shared/test/page-object';

export abstract class ErrorMessagesPageObject extends PageObject {
  selectors = {
    main: '.error-messages',
    buttonShowErrors: 'button.show-errors'
  };

  abstract expectMessage(message: string): void;
}
