import { User } from '@ygg/shared/user/core';
import * as testAccounts from '@ygg/env/test-accounts.json';
import { extend } from 'lodash';

export const testUsers: User[] = testAccounts.accounts.map(account => {
  const user = User.forge();
  extend(user, account);
  // user.id = account.id;
  // user.email = account.email;
  // user.account = account.email;
  // user.password = account.password;
  return user;
});
