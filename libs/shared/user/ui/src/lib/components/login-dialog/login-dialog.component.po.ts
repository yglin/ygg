import { PageObject } from '@ygg/shared/test/page-object';
import { TestAccount } from '@ygg/shared/user/core';

export abstract class LoginDialogPageObject extends PageObject {
  selectors = {
    main: '.login-dialog',
    buttonGoogle: 'button.btn-google',
    buttonFacebook: 'button.btn-facebook',
    inputTestAccountEmail: '.test-account input[type="email"]',
    inputTestAccountPassword: '.test-account input[type="password"]',
    buttonLoginTest: '.test-account button.login-test'
  };

  abstract expectVisible(): void;
  abstract expectClosed(): void;
  abstract loginGoogle(): void;
  abstract loginFacebook(): void;
  abstract loginTest(account: TestAccount): void;
}
