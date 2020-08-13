import { MailSlurp } from 'mailslurp-client';
import { MatchOption } from 'mailslurp-client/dist/generated';
import { isEmpty } from 'lodash';
const timeout = 60000;
const mailslurp = new MailSlurp({
  apiKey: Cypress.env('MAILSLURP_API_KEY')
});

const MAX_RETRY = 5;

Cypress.Commands.add('createInbox', () => {
  return mailslurp.createInbox() as any;
});

Cypress.Commands.add('waitForLatestEmail', inboxId => {
  return mailslurp.waitForLatestEmail(inboxId) as any;
});

Cypress.Commands.add(
  'waitForMatchingEmail',
  (inboxId: string, subjectKeyword: string) => {
    return cy.wrap(
      new Cypress.Promise((resolve, reject) => {
        mailslurp
          .waitForMatchingEmails(
            {
              matches: [
                {
                  field: MatchOption.FieldEnum.SUBJECT,
                  should: MatchOption.ShouldEnum.CONTAIN,
                  value: subjectKeyword
                }
              ]
            },
            1,
            inboxId,
            timeout
          )
          .then(
            matched => {
              if (isEmpty(matched)) {
                reject(
                  new Error(
                    `Not found any email with subject contains ${subjectKeyword}`
                  )
                );
              } else {
                mailslurp.getEmail(matched[0].id).then(
                  email => resolve(email),
                  error => reject(error)
                );
              }
            },
            error => reject(error)
          );
      }),
      { timeout: timeout }
    );
  }
);

// export const testEmail = `yggy.${Cypress.env(
//   'MAILOSAUR_SERVER_ID'
// )}@mailosaur.io`;

// Cypress.Commands.add(
//   'waitEmail',
//   (search: any): Cypress.Chainable<any> => {
//     search = defaults(search, {
//       sentTo: testEmail
//     });
//     let retry = -1;

//     function pollingMailosaur(): Cypress.Chainable<any> {
//       retry += 1;
//       return cy
//         .request({
//           method: 'POST',
//           url: `https://mailosaur.com/api/messages/await?server=${Cypress.env(
//             'MAILOSAUR_SERVER_ID'
//           )}`,
//           headers: {
//             Authorization: `Basic ${btoa(Cypress.env('MAILOSAUR_API_KEY'))}`
//           },
//           body: search
//         })
//         .then(response => {
//           if (response.status === 200) {
//             console.log('Stop here, FUCK!!!');
//             return response.body;
//           } else if (retry < MAX_RETRY) {
//             return pollingMailosaur();
//           } else {
//             throw new Error(
//               `Failed to polling request Mailosaur, retried ${MAX_RETRY} times`
//             );
//           }
//         });
//     }

//     return pollingMailosaur();
//   }
// );
