import { PageObject } from '@ygg/shared/test/page-object';

export abstract class LoginDialogPageObject extends PageObject {
  selectors = {
    main: '.login-dialog',
    buttonGoogle: 'button.btn-google',
    buttonFacebook: 'button.btn-facebook'
  };

  abstract expectVisible(): void;
  abstract expectClosed(): void;
  abstract loginGoogle(): void;
  abstract loginFacebook(): void;
}
