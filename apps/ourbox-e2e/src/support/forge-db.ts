import { User } from '@ygg/shared/user/core';
import { theMockDatabase } from '@ygg/shared/test/cypress';
import { defaults, range } from 'lodash';
// import * as env from "@ygg/env/environments.local.json";

export default function forgeDB() {
  // forge users
  const users: User[] = forgeUsers();
  users.forEach(user =>
    theMockDatabase.insert(`${User.collection}/${user.id}`, user)
  );
  
  // forge boxes
  

}

function forgeUsers(options?: { count: number }): User[] {
  options = defaults(options, { count: 100 });
  return range(options.count).map(() => User.forge());
}
