export const getGreeting = () => cy.get('h1');

export const loginAnonymously = () => {
  cy.get('button#login').click();
  cy.wait(1000);
  cy.get('div#login-dialog button#login-anonymous').click();
};

