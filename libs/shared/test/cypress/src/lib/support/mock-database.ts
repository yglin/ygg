import { values, entries, get } from 'lodash';
import {
  SerializableJSON,
  isSerializableJSON,
  Entity,
  isEntity
} from '@ygg/shared/infra/data-access';

export interface Document {
  path: string;
  data?: any;
}

export class MockDatabase {
  static alias = 'mockDatabase';

  documents: { [path: string]: Document } = {};
  entities: { [path: string]: any } = {};
  RTDBBackup: { [path: string]: any } = {};

  constructor() {}

  pushDocument(path: string, data?: any) {
    this.documents[path] = { path, data };
  }

  insert(path: string, data: any): Cypress.Chainable<any> {
    // @ts-ignore
    cy.callFirestore('set', path, data).then(() => {
      cy.log(`Insert test data at ${path} in firebase firestore DB`);
      if (isEntity(data)) {
        this.entities[path] = data;
        data = data.toJSON();
      }
      this.pushDocument(path, data);
      cy.wrap(data).as(data.id);
    });
    return cy.get(`@${data.id}`);
  }

  insertRTDB(path: string, data: any): Cypress.Chainable<any> {
    const now = new Date().valueOf();
    const aliasId = `${path.replace(/\//g, '_')}_${now}`;
    cy.log(aliasId);
    // @ts-ignore
    cy.callRtdb('set', path, data).then(() => {
      cy.log(`Insert test data at ${path} in firebase realtime DB`);
      // this.documentsRTDB[path] = { path, data };
      cy.wrap(data).as(aliasId);
    });
    // return cy.wait(10000);
    return cy.get(`@${aliasId}`, { timeout: 20000 });
  }

  delete(path: string) {
    // @ts-ignore
    cy.callFirestore('delete', path);
    cy.log(`Delete data at ${path} in firebase firestore DB`);
  }

  deleteRTDB(path: string) {
    // @ts-ignore
    cy.callRtdb('delete', path);
    cy.log(`Delete data at ${path} in firebase realtime DB`);
  }

  backupRTDB(path: string): Cypress.Chainable<any> {
    const aliasName = `backup-RTDB-${path}`;
    // @ts-ignore
    cy.callRtdb('get', path).then(data => {
      this.RTDBBackup[path] = data;
      cy.wrap(data).as(aliasName);
    });
    return cy.get(`@${aliasName}`);
  }

  restoreRTDB(path?: string) {
    if (path) {
      if (path in this.RTDBBackup) {
        // @ts-ignore
        cy.callRtdb('set', path, this.RTDBBackup[path]).then(() => {
          cy.log(`Restore backup data at ${path} in firebase realtime DB`);
        });
      }
    } else {
      cy.wrap(entries(this.RTDBBackup)).each((entry: any) => {
        if (entry && entry.length >= 2) {
          const path = entry[0];
          const data = entry[1];
          // @ts-ignore
          cy.callRtdb('set', path, data).then(() => {
            cy.log(`Restore backup data at ${path} in firebase realtime DB`);
          });
        }
      });
    }
  }

  getEntity<T extends Entity>(path: string): T {
    if (!(path in this.entities)) {
      throw new Error(`MockDatabase: Can not find entity of path "${path}"`);
    }
    return this.entities[path];
  }

  clear() {
    cy.wrap<Document[]>(values(this.documents)).each((document: any) => {
      this.delete(document.path);
    });
    // cy.wrap(values(this.documentsRTDB)).each((document: any) => {
    //   this.deleteRTDB(document.path);
    // });
  }
}

export const theMockDatabase = new MockDatabase();
