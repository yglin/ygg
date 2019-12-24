import { values, isEmpty } from "lodash";
import { Tags } from '@ygg/tags/core';
import { Addition } from '@ygg/resource/core';

export interface Document {
  path: string;
  data: any;
}

export class MockDatabase {
  documents: { [path: string]: Document } = {};

  pushDocument(doc: Document) {
    this.documents[doc.path] = doc;
    if (doc.data && !isEmpty(doc.data.tags)) {
      new Tags(doc.data.tags).forEach(tag => {
        const tagPath = `tags/${tag.id}`;
        this.documents[tagPath] = {
          path: tagPath,
          data: tag
        };
      });
    }
    if (doc.data && !isEmpty(doc.data.additions)) {
      doc.data.additions.forEach(eq => {
        this.pushDocument({
          path: `${Addition.collection}/${eq.id}`,
          data: eq
        });
      });
    }
  }


  insertDocuments(documents: Document[]): Cypress.Chainable<any> {
    return cy.wrap(documents).each((doc: Document) => {
      this.insert(doc.path, doc.data);
    }).then(() => {
      cy.log('Wait for database to persist test data');
      cy.wait(10000);
    });
  }

  insert(path: string, data: any): Cypress.Chainable<any> {
    // @ts-ignore
    cy.callFirestore('set', path, data).then(() => {
      cy.log(`Insert test data at ${path}`);
      this.pushDocument({ path, data });
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
