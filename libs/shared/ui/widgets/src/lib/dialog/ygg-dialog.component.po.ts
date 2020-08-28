import { PageObject } from '@ygg/shared/test/page-object';

export abstract class YggDialogPageObject extends PageObject {
  static selector = '.ygg-dialog.active';

  selectors = {
    main: YggDialogPageObject.selector,
    buttonConfirm: 'button.confirm',
    buttonCancel: 'button.cancel'
  };

  abstract expectVisible(): void;
  abstract expectClosed(): void;
  abstract confirm(): void;
  abstract cancel(): void;
}
