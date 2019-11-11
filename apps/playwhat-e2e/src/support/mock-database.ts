import { values } from "lodash";
import { Tags } from '@ygg/tags/core';

interface Document {
  path: string;
  data: any;
}

export class MockDatabase {
  documents: { [path: string]: Document } = {};

  pushDocument(doc: Document) {
    this.documents[doc.path] = doc;
    if (doc.data && doc.data.tags) {
      new Tags(doc.data.tags).forEach(tag => {
        const tagPath = `tags/${tag.id}`;
        this.documents[tagPath] = {
          path: tagPath,
          data: tag
        };
      });
    }
  }

  insert(path: string, data: any): Cypress.Chainable<any> {
    // @ts-ignore
    cy.callFirestore('set', path, data).then(() => {
      cy.log(`Insert test data at ${path}`);
      this.pushDocument({ path, data });
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
    return cy.wrap<Document[]>(values(this.documents)).each((document: any) => {
      this.delete(document.path);
    });
  }
}