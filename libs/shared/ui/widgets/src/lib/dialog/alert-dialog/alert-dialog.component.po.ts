import { PageObject } from '@ygg/shared/test/page-object';

export interface IAlertDialogInput {
  content: string;
}

export abstract class AlertDialogPageObject extends PageObject {
  selectors = {
    main: '.alert-dialog',
    content: '.content',
    buttonConfirm: 'button.confirm',
    icon: '.type-icon'
  };

  abstract expectMessage(message: string): void;
  // abstract confirm(): void;
}
