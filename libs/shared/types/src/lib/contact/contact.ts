import { sample } from 'lodash';

interface User {
  name: string;
  phone: string;
  email: string;
  lineID?: string;
}

export class Contact {
  userId?: string;
  name: string;
  phone: string;
  email: string;
  lineID?: string;

  static isContact(value: any): value is Contact {
    return value && value.name && value.phone && value.email;
  }

  static forge(): Contact {
    const forged = new Contact();
    forged.name = sample(['馬＊久', '蔣＊虢', '李＊灰', '菜＊文', '陳＊匾']);
    forged.email = 'taiwanNO1@ygmail.com';
    forged.phone = '0999089457';
    return forged;
  }

  fromUser(user: User): this {
    this.name = user.name;
    this.phone = user.phone;
    this.email = user.email;
    if (user.lineID) {
      this.lineID = user.lineID;
    }
    return this;
  }
}
