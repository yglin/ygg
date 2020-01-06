import { values } from 'lodash';

export interface Document {
  path: string;
  data?: any;
}

export class MockDatabase {
  documents: { [path: string]: Document } = {};

  pushDocument(path: string, data?: any) {
    this.documents[path] = { path, data };
  }

  insert(path: string, data: any): Cypress.Chainable<any> {
    // @ts-ignore
    cy.callFirestore('set', path, data).then(() => {
      cy.log(`Insert test data at ${path}`);
      this.pushDocument(path, data);
      cy.wrap(data).as(data.id);
    });
    return cy.get(`@${data.id}`);
  }

  delete(path: string) {
    // @ts-ignore
    cy.callFirestore('delete', path);
    cy.log(`Delete data at ${path}`);
  }

  clear(): Cypress.Chainable<any> {
    return cy.wrap<Document[]>(values(this.documents)).each((document: any) => {
      this.delete(document.path);
    });
  }
}
