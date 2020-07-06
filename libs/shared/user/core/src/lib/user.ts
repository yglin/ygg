// import {DataItem, toJSONDeep} from '@ygg/shared/infra/data-access';
import {extend, sample} from 'lodash';
import * as firebase from 'firebase/app';
import { Entity, toJSONDeep } from '@ygg/shared/infra/core';

export enum UserState {
  Unknown = 0,
  New,
  Activated,
  Retired,
  Suspended
}

export class User implements Entity {
  static collection = 'users';
  
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

  static isUser(value: any): value is User {
    return !!(value && value.id);
  }

// tslint:disable-next-line: member-ordering
  static forgedCount = 0;
  static forge(): User {
    const forged = new User();
    forged.id = `anony-mummy-honey-spaghetti-your-moms-fatty-${User.forgedCount++}`;
    forged.isAnonymous = true;
    forged.name = sample(['馬＊久', '蔣＊虢', '李＊灰', '菜＊文', '陳＊匾']);
    forged.email = 'taiwanNO1@ygmail.com';
    forged.phone = '0999089457';
    forged.avatarUrl = new URL(sample([
      'https://upload.wikimedia.org/wikipedia/commons/7/73/Facebook_Haha_React.png',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Chicken_icon_05.svg/816px-Chicken_icon_05.svg.png',
      'https://upload.wikimedia.org/wikipedia/en/thumb/3/34/AlthepalHappyface.svg/256px-AlthepalHappyface.svg.png',
      'https://upload.wikimedia.org/wikipedia/commons/4/48/Govi.png',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Phantom_Open_Emoji_1f619.svg/64px-Phantom_Open_Emoji_1f619.svg.png',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Breathe-face-devil-grin.svg/128px-Breathe-face-devil-grin.svg.png'
    ]));
    return forged;
  }

  static fromFirebase(firebaseUser: firebase.User): User {
    const user = new User();
    user.id = firebaseUser.uid;
    user.name = firebaseUser.displayName;
    try {
      user.avatarUrl = new URL(firebaseUser.photoURL);
    } catch (error) {
      console.warn(error);      
    }
    user.email = firebaseUser.email;
    user.phone = firebaseUser.phoneNumber;
    return user;
  }

  constructor() {
    this.isAnonymous = false;
    this.createAt = new Date();
    this.state = UserState.New;
    this.providers = {};
  }

  fromJSON(data: any): this {
    extend(this, data);
    if (data.createAt) {
      this.createAt = new Date(data.createAt);
    }
    if (typeof data.avatarUrl === 'string') {
      try {
        this.avatarUrl = new URL(data.avatarUrl);
      } catch (error) {
        console.error(error);        
      }
    }
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
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
    if (userProfile.additionalUserInfo &&
        userProfile.additionalUserInfo.profile) {
      profile = userProfile.additionalUserInfo.profile;
    }
    this.providers[provider] = profile;

    if (this.state === UserState.New) {
      this.state = UserState.Activated;
    }
    return this;
  }
}