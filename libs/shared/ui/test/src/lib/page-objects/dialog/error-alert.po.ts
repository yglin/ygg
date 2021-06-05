import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { YggDialogPageObjectCypress } from './dialog.po';

export class ErrorAlertPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.error-alert',
  };

  constructor() {
    super();
    const parentDialogPO = new YggDialogPageObjectCypress();
    this.parentSelector = parentDialogPO.getSelector();
  }
}
