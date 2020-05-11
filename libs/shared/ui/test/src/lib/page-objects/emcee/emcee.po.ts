import { PageObject } from '@ygg/shared/test/page-object';
import { ConfirmDialogPageObjectCypress, AlertDialogPageObjectCypress } from '../dialog';

export class EmceePageObjectCypress extends PageObject {
  selectors = {
    main: ''
  };

  confirm(message: string) {
    const confirmDialogPO = new ConfirmDialogPageObjectCypress();
    confirmDialogPO.expectMessage(message);
    confirmDialogPO.confirm();
    confirmDialogPO.expectClosed();
  }

  alert(message: string) {
    const alertDialogPO = new AlertDialogPageObjectCypress();
    alertDialogPO.expectMessage(message);
    alertDialogPO.confirm();
    alertDialogPO.expectClosed();

  }
}
