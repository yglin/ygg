import { User } from './user';

export abstract class UserAccessor {
  abstract async get(id: string): Promise<User>;
}
