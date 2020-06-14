import * as functions from 'firebase-functions';
import {
  InvitationCollection,
  deserializer,
  Invitation
} from '@ygg/shared/user/core';
import { NodeMailgun } from 'ts-mailgun';

const mailer = new NodeMailgun();
mailer.apiKey = 'key-ec2a8df6896b9c64bcd02fa7c64ba663'; // Set your API key
mailer.domain = 'mail.ygg.tw'; // Set the domain you registered earlier
mailer.fromEmail = 'yglin@mail.ygg.tw'; // Set your from email
mailer.fromTitle = `來自 ygg.tw 的信件`; // Set the name you would like to send from

export const onInvitationCreate = functions.firestore
  .document(`${InvitationCollection}/{id}`)
  .onCreate((snap, context) => {
    const invitation: Invitation = deserializer(snap.data());
    mailer.init();
    return mailer.send(
      invitation.email,
      invitation.mailSubject,
      invitation.mailContent
    );
  });
