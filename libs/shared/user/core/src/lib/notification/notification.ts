import { Entity, generateID, toJSONDeep } from '@ygg/shared/infra/core';
import { cloneDeep, extend, sample } from 'lodash';
import * as moment from 'moment';
import { config } from '../config';

export class Notification implements Entity {
  static collection = 'notifications';

  id: string;
  type: string;
  inviterId: string;
  inviteeId?: string;
  email: string;
  mailSubject: string;
  mailContent: string;
  confirmMessage: string;
  landingUrl?: string;
  expireDate: Date;
  createAt: Date;
  read = false;
  data: any;

  static forge(): Notification {
    const ntf = new Notification({
      type: 'forged',
      inviterId: 'yggy',
      inviteeId: 'gyyg',
      email: 'ygg@ygmail.com',
      mailSubject: `${sample([
        'Penis enlargement secret',
        'Beautiful girl wanna sex',
        'Stay home and earning $1000/month',
        'Click on link and meet local milf',
        'You have earned our big prize'
      ])}_${Date.now()}`,
      mailContent: '<pre>This is a forged mail, nothing matters</pre>',
      confirmMessage:
        "You've received a forged notification. Something is wrong",
      landingUrl: 'http:localhost:4200'
    });
    return ntf;
  }

  constructor(options: {
    id?: string;
    type: string;
    inviterId: string;
    inviteeId?: string;
    email: string;
    mailSubject: string;
    mailContent: string;
    confirmMessage: string;
    landingUrl?: string;
    data?: any;
  }) {
    this.id = generateID();
    this.createAt = new Date();
    this.expireDate = moment()
      .add(config.notification.expireDays, 'days')
      .toDate();
    extend(this, options);
  }

  static serializer(notification: Notification): any {
    return toJSONDeep(notification);
  }

  static deserializer(data: any): Notification {
    if (!data) {
      return null;
    }
    const notification: Notification = new Notification(data);
    if (data.createAt) {
      notification.createAt = new Date(data.createAt);
    }
    if (data.expireDate) {
      notification.expireDate = new Date(data.expireDate);
    }
    return notification;
  }
}
