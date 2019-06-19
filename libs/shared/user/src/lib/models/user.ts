import {DataItem, toJSONDeep} from '@ygg/shared/infra/data-access';
import {extend, sample} from 'lodash';

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

  static forge(): User {
    const anonymous = new User();
    anonymous.id = 'anony-mummy-honey-spaghetti-your-moms-fatty';
    anonymous.isAnonymous = true;
    anonymous.name = sample(['馬＊久', '蔣＊虢', '李＊灰', '菜＊文', '陳＊匾']);
    anonymous.email = 'taiwanNO1@ygmail.com';
    anonymous.phone = '0999089457';
    anonymous.avatarUrl = new URL(sample([
      'https://upload.wikimedia.org/wikipedia/commons/7/73/Facebook_Haha_React.png',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Chicken_icon_05.svg/816px-Chicken_icon_05.svg.png',
      'https://upload.wikimedia.org/wikipedia/en/thumb/3/34/AlthepalHappyface.svg/256px-AlthepalHappyface.svg.png',
      'https://upload.wikimedia.org/wikipedia/commons/4/48/Govi.png',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Phantom_Open_Emoji_1f619.svg/64px-Phantom_Open_Emoji_1f619.svg.png',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Breathe-face-devil-grin.svg/128px-Breathe-face-devil-grin.svg.png'
    ]));
    return anonymous;
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