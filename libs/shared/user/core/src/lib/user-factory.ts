import { User } from './user';
import { Dialog } from '@ygg/shared/infra/core';

export interface IUsersByEmail {
  [email: string]: User;
}

export abstract class UserFactory {
  abstract async selectUsersByEmail(): Promise<IUsersByEmail>;
}
