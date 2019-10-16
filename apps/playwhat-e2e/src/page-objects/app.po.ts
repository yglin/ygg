
export function login() {
  // @ts-ignore
  cy.login();
  cy.get('.account-widget .user-account').should('be.visible');
  //@ts-ignore
  cy.getCurrentUser().then(user => {
    cy.log(`Login as user ${user.displayName}, uid=${user.uid}`);
  });
}

export function loginAdmin() {
  // @ts-ignore
  cy.login();
};

export function logout() {
  // @ts-ignore
  cy.logout();
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