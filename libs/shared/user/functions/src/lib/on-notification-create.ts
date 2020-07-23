import * as functions from 'firebase-functions';
import {
  NotificationCollection,
  deserializer,
  Notification
} from '@ygg/shared/user/core';
const mailgun = require('mailgun-js')({
  apiKey: 'key-ec2a8df6896b9c64bcd02fa7c64ba663',
  domain: 'mail.ygg.tw'
});
const MailComposer = require('nodemailer/lib/mail-composer');

// const NotificationCollection = 'notifications';
export const onNotificationCreate = functions.firestore
  .document(`${NotificationCollection}/{id}`)
  .onCreate((snap, context) => {
    const notification: Notification = deserializer(snap.data());
    // const mailData = {
    //   from: 'yglin@mail.ygg.tw',
    //   to: notification.email,
    //   subject: notification.mailSubject,
    //   text: notification.mailContent
    // };

    const mailOptions = {
      from: 'yglin@mail.ygg.tw',
      to: notification.email,
      subject: notification.mailSubject,
      html: notification.mailContent
    };

    const mail = new MailComposer(mailOptions);

    return new Promise((resolve, reject) => {
      mail.compile().build((complieError, message) => {
        if (complieError) {
          reject(complieError);
          return;
        }

        const dataToSend = {
          to: notification.email,
          message: message.toString('ascii')
        };

        mailgun.messages().sendMime(dataToSend, (sendError, body) => {
          if (sendError) {
            reject(sendError);
          } else {
            resolve(body);
          }
        });
      });
      // mailgun.messages().send(mailData, (error, body) => {
      //   if (error) {
      //     reject(error);
      //   } else {
      //     resolve(body);
      //   }
      // });
    });
  });
