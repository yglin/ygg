import { extend } from 'lodash';
import { DataItem } from '@ygg/shared/interfaces';

export enum UserState {
  Unknown = 0,
  New,
  Activated,
  Retired,
  Suspended
}

export class User implements DataItem {
  id: string;
  isAnonymous: boolean;
  createAt: Date;
  name: string;
  account: string;
  email: string;
  phone: string;
  avatarUrl: URL;
  providers: any;
  state: UserState;

  static newAnonymous(): User {
    const anonymous = new User();
    anonymous.id = 'anony-mummy-honey-spaghetti-your-moms-fatty';
    anonymous.isAnonymous = true;
    anonymous.name = '＊＊＊';
    anonymous.avatarUrl = new URL('https://upload.wikimedia.org/wikipedia/commons/7/73/Facebook_Haha_React.png');
    return anonymous;
  }

  constructor() {
    this.isAnonymous = false;
    this.createAt = new Date();
    this.state = UserState.New;
    this.providers = {};
  }

  toData(): any {
    return JSON.parse(JSON.stringify(this));
  }

  fromData(data: any): this {
    extend(this, data);
    if (data.createAt) {
      this.createAt = new Date(data.createAt);
    }
    if (typeof data.avatarUrl === 'string') {
      this.avatarUrl = new URL(data.avatarUrl);
    }
    return this;
  }

  connectProvider(provider: string, userProfile: any = {}): this {
    if (userProfile.uid) {
      this.id = userProfile.uid;
    }

    this.isAnonymous = userProfile.isAnonymous === true;

    if (!this.account) {
      if (userProfile.email) {
        this.account = userProfile.email;
      }
    }
    if (!this.name) {
      if (userProfile.displayName) {
        this.name = userProfile.displayName;
      }
    }
    if (!this.phone) {
      if (userProfile.phoneNumber) {
        this.phone = userProfile.phoneNumber;
      }
    }
    if (!this.email) {
      if (userProfile.email) {
        this.email = userProfile.email;
      }
    }

    if (userProfile.photoURL) {
      this.avatarUrl = new URL(userProfile.photoURL);
    }

    let profile = userProfile;
    if (userProfile.additionalUserInfo && userProfile.additionalUserInfo.profile) {
      profile = userProfile.additionalUserInfo.profile;
    }
    this.providers[provider] = profile;

    if (this.state === UserState.New) {
      this.state = UserState.Activated;
    }
    return this;
  }

}