import { User } from './user';
import { Observable } from 'rxjs';

export abstract class Authenticator {
  currentUser: User;
  currentUser$: Observable<User>;

  isMe(userId: string): boolean {
    return this.currentUser && this.currentUser.id === userId;
  }

  abstract requestLogin(options?: any): Promise<User>;
}
