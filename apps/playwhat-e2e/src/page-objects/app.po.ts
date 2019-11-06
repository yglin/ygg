import { User } from '@ygg/shared/user';

const aliasCurrrentLoginUser = 'current-login-user';

export function login(): Cypress.Chainable<User> {
  // @ts-ignore
  cy.login().then(firebaseUser => {
    const user: User = User.fromFirebase(firebaseUser);
    cy.log(`Login as user ${user.name}, uid=${user.id}`);
    cy.wrap(user).as(aliasCurrrentLoginUser);
  });
  cy.get('.account-widget .user-account', { timeout: 10000 }).should(
    'be.visible'
  );
  //@ts-ignore
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

export function hitUserMenu(menuButtonId?: string) {
  cy.get('#account-widget .menu-trigger').click();
  if (menuButtonId) {
    cy.get(`#user-menu button#${menuButtonId}`).click();
  }
}

export function gotoAdminDashboard() {
  cy.visit('/');
  loginAdmin();
  // // Wait for initial auto login,
  // // this is definitely an ugly workaround right now, but what the heck.
  // cy.wait(3000);
  cy.get('#account-widget .menu-trigger').click();
  cy.get('#user-menu button#admin').click();
}

export function insertDB(
  collection: string,
  data: any
): Cypress.Chainable<any> {
  const path = `${collection}/${data.id}`;
  // @ts-ignore
  cy.callFirestore('set', path, data).then(() => {
    cy.log(`Insert test data at ${path}`);
    cy.wrap(data).as(data.id);
  });
  return cy.get(`@${data.id}`);
}
