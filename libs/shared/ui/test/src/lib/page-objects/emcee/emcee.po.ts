import { PageObject } from '@ygg/shared/test/page-object';
import {
  ConfirmDialogPageObjectCypress,
  AlertDialogPageObjectCypress
} from '../dialog';

export class EmceePageObjectCypress extends PageObject {
  selectors = {
    main: ''
  };

  confirm(
    message: string,
    options: {
      doConfirm?: boolean;
      hasFollowedDialog?: boolean;
    } = { doConfirm: true }
  ) {
    const confirmDialogPO = new ConfirmDialogPageObjectCypress();
    confirmDialogPO.expectMessage(message);
    if (options.doConfirm) {
      confirmDialogPO.confirm();
    } else {
      confirmDialogPO.cancel();
    }
    // // console.log(options);
    // if (!options.hasFollowedDialog) {
    //   confirmDialogPO.expectClosed();
    // }
  }

  alert(message: string) {
    const alertDialogPO = new AlertDialogPageObjectCypress();
    alertDialogPO.expectMessage(message);
    alertDialogPO.confirm();
    // alertDialogPO.expectClosed();
  }
}
