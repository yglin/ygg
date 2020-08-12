import { Authenticator, User } from "@ygg/shared/user/core"

export class AuthenticatorFunctions extends Authenticator {
  async requestLogin(): Promise<User> {
    throw new Error("Method not implemented.");
  }
}