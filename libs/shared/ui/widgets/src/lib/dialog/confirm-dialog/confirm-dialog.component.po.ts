import { PageObject } from '@ygg/shared/test/page-object';

export interface IConfirmDialogInput {
  content: string;
}

export abstract class ConfirmDialogPageObject extends PageObject {
  selectors = {
    main: '.confirm-dialog',
    content: '.content',
    buttonConfirm: 'button.confirm',
    buttonCancel: 'button.cancel'
  };

  abstract expectMessage(message: string): void;
  abstract confirm(): void;
  abstract cancel(): void;
}
