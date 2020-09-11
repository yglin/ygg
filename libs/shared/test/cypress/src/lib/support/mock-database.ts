import { Entity, toJSONDeep, isEntity } from '@ygg/shared/infra/core';
import { User } from '@ygg/shared/user/core';
import {
  TheThing,
  TheThingImitation,
  TheThingState
} from '@ygg/the-thing/core';
import { entries } from 'lodash';

export interface Document {
  path: string;
  data?: any;
}

export class MockDatabase {
  static alias = 'mockDatabase';

  documents: { [path: string]: Document } = {};
  documentsBackup: { [path: string]: any } = {};
  entities: { [path: string]: any } = {};
  RTDBBackup: { [path: string]: any } = {};

  constructor() {}

  pushDocument(path: string, data?: any) {
    this.documents[path] = { path, data };
  }

  setAdmins(ids: string[]): Cypress.Chainable<any> {
    const path = 'admin/users/roles/admins';
    this.backupRTDB(path);
    return this.insertRTDB(path, ids);
  }

  setState(
    thing: TheThing,
    imitation: TheThingImitation,
    state: TheThingState
  ): Cypress.Chainable<any> {
    const path = `${thing.collection}/${thing.id}`;
    const data = { states: {} };
    data.states[imitation.stateName] = state.value;
    return this.update(path, data);
  }

  insert(path: string, data: any): Cypress.Chainable<any> {
    // Backup first
    cy.callFirestore('get', path).then(backupData => {
      if (!(path in this.documentsBackup)) {
        try {
          backupData = JSON.parse(JSON.stringify(backupData));
          this.documentsBackup[path] = backupData;
        } catch (error) {
          console.error(error);
        }
      }
    });
    cy.log(`Insert test data at ${path} in firebase firestore DB`);
    const alias = `${data.id}_${Date.now()}`;
    // @ts-ignore
    cy.callFirestore('set', path, toJSONDeep(data)).then(() => {
      if (isEntity(data)) {
        this.entities[path] = data;
        // data = data.toJSON();
      }
      // this.pushDocument(path, data);
      cy.wrap(data).as(alias);
    });
    return cy.get(`@${alias}`, { timeout: 5000 });
  }

  insertUsers(users: User[]) {
    cy.wrap(users).each((user: User) =>
      this.insert(`${User.collection}/${user.id}`, user)
    );
  }

  update(path: string, data: any): Cypress.Chainable<any> {
    // Backup first
    cy.callFirestore('get', path).then(backupData => {
      if (!(path in this.documentsBackup) && backupData) {
        try {
          backupData = JSON.parse(JSON.stringify(backupData));
          this.documentsBackup[path] = backupData;
        } catch (error) {
          console.error(error);
        }
      }
    });
    return cy.callFirestore('update', path, data).then(() => {
      return cy.log(`Update test data at ${path} in firebase firestore DB`);
    });
  }

  restoreDocuments() {
    let restoreOp: Cypress.Chainable<any>;
    cy.wrap(entries(this.documentsBackup)).each((entry: any) => {
      if (entry && entry.length >= 2) {
        const path = entry[0];
        const backupData = entry[1];
        // if (!!backupData) {
        //   cy.log(`Restore data at path ${path}`);
        //   console.log(backupData);
        //   restoreOp = cy.callFirestore('set', path, backupData);
        // } else {
        // XXX yglin 2020/07/23 FUCK IT, KILL THEM ALL...
        cy.log(`Delete data at path ${path}`);
        restoreOp = cy.callFirestore('delete', path);
        // }
        restoreOp.then(() => {
          delete this.documentsBackup[path];
        });
      }
    });
  }

  insertRTDB(path: string, data: any): Cypress.Chainable<any> {
    // Backup RTDB
    cy.callRtdb('get', path).then(backupData => {
      if (!(path in this.RTDBBackup)) {
        this.RTDBBackup[path] = !!backupData ? backupData : null;
      }
    });
    const now = new Date().valueOf();
    const aliasId = `${path.replace(/\//g, '_')}_${now}`;
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
    cy.log(`Delete data at ${path} in firebase firestore DB`);
    // @ts-ignore
    cy.callFirestore('delete', path);
  }

  deleteRTDB(path: string) {
    cy.log(`Delete data at ${path} in firebase realtime DB`);
    // @ts-ignore
    cy.callRtdb('delete', path);
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
        let restoreOp: Cypress.Chainable<any>;
        if (entry && entry.length >= 2) {
          const _path = entry[0];
          const backupData = entry[1];
          if (!!backupData) {
            restoreOp = cy.callRtdb('set', _path, backupData);
          } else {
            restoreOp = cy.callRtdb('delete', _path);
          }
          restoreOp.then(() => {
            delete this.RTDBBackup[path];
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
    this.restoreDocuments();
    // this.restoreRTDB();
    // cy.wrap<Document[]>(values(this.documents)).each((document: any) => {
    //   this.delete(document.path);
    // });
    // cy.wrap(values(this.documentsRTDB)).each((document: any) => {
    //   this.deleteRTDB(document.path);
    // });
  }
}

export const theMockDatabase = new MockDatabase();
