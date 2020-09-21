import * as functions from 'firebase-functions';
import { Notification } from '@ygg/shared/user/core';
import { getEnv } from '@ygg/shared/infra/core';
const mailgunConfig = getEnv('mailgun');
const mailgun = require('mailgun-js')(mailgunConfig);
const MailComposer = require('nodemailer/lib/mail-composer');
const firebaseEnv = getEnv('firebase');

// const NotificationCollection = 'notifications';
export const onNotificationCreate = functions
  .region(firebaseEnv.region)
  .firestore.document(`${Notification.collection}/{id}`)
  .onCreate((snap, context) => {
    const notification: Notification = Notification.deserializer(snap.data());
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
