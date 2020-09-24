export function beforeAll(): Cypress.Chainable<any> {
  return cy.window().then(win => {
    // Clear Firebase Authentication state
    win.indexedDB.deleteDatabase('firebaseLocalStorageDb');
    return win;
  });
}
