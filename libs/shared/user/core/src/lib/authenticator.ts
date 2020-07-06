import { User } from './user';
import { Observable } from 'rxjs';

export abstract class Authenticator {
  currentUser: User;
  currentUser$: Observable<User>;
  abstract async requestLogin(): Promise<User>;
  isMe(userId: string): boolean {
    return this.currentUser && this.currentUser.id === userId;
  }
}
