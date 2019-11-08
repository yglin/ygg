import { Tags } from '@ygg/tags/core';

interface Document {
  path: string;
  data: any;
}

export class MockDatabase {
  documents: Document[] = [];

  insert(path: string, data: any): Cypress.Chainable<any> {
    // @ts-ignore
    cy.callFirestore('set', path, data).then(() => {
      cy.log(`Insert test data at ${path}`);
      this.documents.push({
        path,
        data
      });
      if (data && data.tags) {
        new Tags(data.tags).forEach(tag => {
          this.documents.push({
            path: `tags/${tag.id}`,
            data: tag
          });
        });
      }
      // Wait for the database to persist data
      cy.wait(10000);
      cy.wrap(data).as(data.id);
    });
    return cy.get(`@${data.id}`);
  }

  delete(path: string) {
    // @ts-ignore
    cy.callFirestore('delete', path);
    cy.log(`Delete test data at ${path}`);
  }

  clear(): Cypress.Chainable<any> {
    return cy.wrap<Document[]>(this.documents).each((document: any) => {
      this.delete(document.path);
    });
  }
}
