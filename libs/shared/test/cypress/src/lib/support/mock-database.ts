export class MockDatabase {
  delete(path: string) {
    // @ts-ignore
    cy.callFirestore('delete', path);
    cy.log(`Delete data at ${path}`);
  }
}
