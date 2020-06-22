import { User } from './user';
import { Observable } from 'rxjs';

export abstract class Authenticator {
  currentUser: User;
  currentUser$: Observable<User>;
  abstract async requestLogin();
}
