// import {DataItem, toJSONDeep} from '@ygg/shared/infra/data-access';
import { extend, sample, random } from 'lodash';
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
    forged.name = sample([
      '馬＊久',
      '蔣＊國',
      '李＊灰',
      '菜＊文',
      '陳＊匾',
      '韓＊🐟',
      '宋＊🐠',
      '連👍',
      '柯阿背',
      '王🐳平',
      '扶🐉王',
      '白🐬'
    ]);
    forged.email = `taiwanNo${random(1, 50)}@ygmail.com`;
    forged.account = forged.email;
    forged.phone = `09780894${random(10, 99)}`;
    forged.avatarUrl = new URL(
      sample([
        'https://i.imgur.com/trZxMHq.jpeg',
        'https://i.imgur.com/YExYEAx.jpg',
        'https://i.imgur.com/sFq0wAC.jpeg',
        'https://i.imgur.com/zfOPmnI.jpeg',
        'https://i.imgur.com/67tSocD.jpeg',
        'https://i.imgur.com/zAZLWd3.jpg',
        'https://i.imgur.com/EFGZiUi.jpeg',
        'https://i.imgur.com/bg0MZPZ.jpg',
        'https://i.imgur.com/Khh79KZ.jpeg',
        'https://i.imgur.com/CKmgMDL.jpg',
        'https://i.imgur.com/S8a6rFQ.jpeg'
      ])
    );
    forged.state = UserState.Activated;
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
    if (
      userProfile.additionalUserInfo &&
      userProfile.additionalUserInfo.profile
    ) {
      profile = userProfile.additionalUserInfo.profile;
    }
    this.providers[provider] = profile;

    if (this.state === UserState.New) {
      this.state = UserState.Activated;
    }
    return this;
  }
}
