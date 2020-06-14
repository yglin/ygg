import * as functions from 'firebase-functions';
import {
  InvitationCollection,
  deserializer,
  Invitation
} from '@ygg/shared/user/core';
const mailgun = require('mailgun-js')({
  apiKey: 'key-ec2a8df6896b9c64bcd02fa7c64ba663',
  domain: 'mail.ygg.tw'
});
const MailComposer = require('nodemailer/lib/mail-composer');

// const InvitationCollection = 'invitations';
export const onInvitationCreate = functions.firestore
  .document(`${InvitationCollection}/{id}`)
  .onCreate((snap, context) => {
    const invitation: Invitation = deserializer(snap.data());
    // const mailData = {
    //   from: 'yglin@mail.ygg.tw',
    //   to: invitation.email,
    //   subject: invitation.mailSubject,
    //   text: invitation.mailContent
    // };

    const mailOptions = {
      from: 'yglin@mail.ygg.tw',
      to: invitation.email,
      subject: invitation.mailSubject,
      html: invitation.mailContent
    };

    const mail = new MailComposer(mailOptions);

    return new Promise((resolve, reject) => {
      mail.compile().build((complieError, message) => {
        if (complieError) {
          reject(complieError);
          return;
        }

        const dataToSend = {
          to: invitation.email,
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
