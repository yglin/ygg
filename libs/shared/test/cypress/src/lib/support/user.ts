import { User } from '@ygg/shared/user';

const aliasCurrrentLoginUser = 'current-login-user';

export function login(): Cypress.Chainable<User> {
  // @ts-ignore
  cy.login().then(firebaseUser => {
    const user: User = User.fromFirebase(firebaseUser);
    cy.log(`Login as user ${user.name}, uid=${user.id}`);
    cy.wrap(user).as(aliasCurrrentLoginUser);
  });
  return getCurrentUser();
}

export function loginAdmin() {
  login();
}

export function logout() {
  // @ts-ignore
  cy.logout();
}

export function getCurrentUser(): Cypress.Chainable<User> {
  return cy.get<User>(`@${aliasCurrrentLoginUser}`);
}
