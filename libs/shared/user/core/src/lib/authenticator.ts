import { User } from './user';

export abstract class Authenticator {
  currentUser: User;
  abstract async requestLogin();
}
