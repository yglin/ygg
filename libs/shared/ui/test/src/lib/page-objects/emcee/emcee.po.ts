import { PageObject } from '@ygg/shared/test/page-object';
import {
  ConfirmDialogPageObjectCypress,
  AlertDialogPageObjectCypress,
  YggDialogPageObjectCypress
} from '../dialog';

export class EmceePageObjectCypress extends PageObject {
  selectors = {
    main: ''
  };
  dialogPO = new YggDialogPageObjectCypress();

  confirm(
    message: string,
    options: {
      doConfirm?: boolean;
      // hasFollowedDialog?: boolean;
    } = { doConfirm: true }
  ) {
    const confirmDialogPO = new ConfirmDialogPageObjectCypress(
      this.dialogPO.getSelector()
    );
    confirmDialogPO.expectMessage(message);
    // cy.pause();
    if (options.doConfirm) {
      this.dialogPO.confirm();
    } else {
      this.dialogPO.cancel();
    }
    // // console.log(options);
    // if (!options.hasFollowedDialog) {
    //   confirmDialogPO.expectClosed();
    // }
  }

  alert(message: string, options?: any) {
    const alertDialogPO = new AlertDialogPageObjectCypress(
      this.dialogPO.getSelector()
    );
    alertDialogPO.expectMessage(message, options);
    // cy.pause();
    this.dialogPO.confirm();
    // alertDialogPO.expectClosed();
  }

  info(message: string, options?: any) {
    const alertDialogPO = new AlertDialogPageObjectCypress(
      this.dialogPO.getSelector()
    );
    alertDialogPO.exepctIcon('info');
    alertDialogPO.expectMessage(message, options);
    this.dialogPO.confirm();
  }

  cancel(message?: string) {
    if (message) {
      this.confirm(message, { doConfirm: false });
    } else {
      this.dialogPO.cancel();
    }
  }
}
