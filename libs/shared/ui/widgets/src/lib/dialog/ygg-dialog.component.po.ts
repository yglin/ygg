import { PageObject } from '@ygg/shared/test/page-object';

export abstract class YggDialogPageObject extends PageObject {
  static selector = '.ygg-dialog';

  selectors = {
    main: YggDialogPageObject.selector,
    buttonConfirm: 'button.confirm'
  };

  abstract expectVisible(): void;
  abstract expectClosed(): void;
  abstract confirm(): void;
  abstract cancel(): void;
}
