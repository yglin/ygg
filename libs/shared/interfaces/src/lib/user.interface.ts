import { Contact } from './contact.interface';

export enum UserState {
  Unknown = 0,
  New,
  Activated,
  Retired,
  Suspended
}

export interface User extends Contact {
  id: string;
  account: string;
  roles: Set<string>;
  // name: string;
  // phone: string;
  // email: string;
  // lineID: string;
  state: UserState;
  avatar: string;
  // providers: { [providerId: string]: any };
}
