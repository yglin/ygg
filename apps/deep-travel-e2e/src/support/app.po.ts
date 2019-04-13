export const getGreeting = () => cy.get('h1');

export const loginAnonymously = () => {
  cy.get('button#login').click();
  cy.wait(1000);
  cy.get('div#login-dialog button#login-anonymous').click();
};

// export const loginAnonymously = (overrides: any = {}) => {

//   // Cypress.log({
//   //   name: 'loginAnonymously'
//   // });

//   const options: any = {
//     method: 'POST',
//     url: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser',
//     qs: {
//       key: 'AIzaSyA0q0wCPnyx--wXaukOp6wPBRBj2L0pSAU'
//     },
//     body: {
//       returnSecureToken: true
//     },
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   };

//   // allow us to override defaults with passed in overrides
//   Cypress._.extend(options, overrides);

//   return cy.request(options).then(() => {
//     return cy.visit('/');
//   });
// };
