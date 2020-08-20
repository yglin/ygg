import {
  MapSearchPageObjectCypress,
  BoxCreatePageObjectCypress,
  MyBoxesPageObjectCypress
} from '@ygg/ourbox/test';
import { waitForLogin, logout } from '@ygg/shared/user/test';
import { login, theMockDatabase, Document } from '@ygg/shared/test/cypress';
import { ImitationBox, RelationshipBoxMember } from '@ygg/ourbox/core';
import promisify from 'cypress-promise';
import { MatTabBodyPortal } from '@angular/material/tabs';
import { RelationRecord } from '@ygg/the-thing/core';
import { User } from '@ygg/shared/user/core';
import { SiteNavigator } from '../../support/site-navigator';

describe('Ourbox home page, as guest(not login)', () => {
  const siteNavigator = new SiteNavigator();
  const mapSearchPO = new MapSearchPageObjectCypress();
  const boxCreatePO = new BoxCreatePageObjectCypress();
  const sampleBox = ImitationBox.forgeTheThing();
  let sampleBoxMemberRelation: RelationRecord;
  const myBoxesPO = new MyBoxesPageObjectCypress();
  const SampleDocuments: Document[] = [];

  before(() => {
    login().then(user => {
      // sampleBox.ownerId = user.id;
      SampleDocuments.push({
        path: `${sampleBox.collection}/${sampleBox.id}`,
        data: sampleBox
      });
      sampleBoxMemberRelation = new RelationRecord({
        subjectCollection: sampleBox.collection,
        subjectId: sampleBox.id,
        objectCollection: User.collection,
        objectId: user.id,
        objectRole: RelationshipBoxMember.role,
        data: {}
      });

      cy.wrap(SampleDocuments).each((doc: Document) => {
        theMockDatabase.insert(doc.path, doc.data);
      });
      cy.visit('/');
      waitForLogin();
    });
  });

  beforeEach(function() {
    siteNavigator.goto('home');
  });

  after(() => {
    theMockDatabase.clear();
  });

  it('Should show link of map-search', () => {
    cy.get('a.map-search').click({ force: true });
    mapSearchPO.expectVisible({ timeout: 10000 });
  });

  it('Should show link of create-box if user has no box', () => {
    // Hide link of my-boxes
    cy.get('a.goto-my-boxes').should('not.be.visible');
    cy.get('a.create-box').click({ force: true });
    boxCreatePO.expectVisible({ timeout: 10000 });
  });

  it('Should show link of my-boxes if user is member of any box', () => {
    theMockDatabase.insert(
      `${RelationRecord.collection}/${sampleBoxMemberRelation.id}`,
      sampleBoxMemberRelation
    );
    // Hide link of create-box
    cy.get('a.create-box', { timeout: 10000 }).should('not.be.visible');
    cy.get('a.goto-my-boxes', { timeout: 10000 }).click({ force: true });
    myBoxesPO.expectVisible({ timeout: 10000 });
  });

  it('Should show links of map-search and create-box as guest', () => {
    logout().then(() => {
      // Hide link of my-boxes
      cy.get('a.goto-my-boxes').should('not.be.visible');

      cy.get('a.create-box').should('be.visible');
      cy.get('a.map-search').should('be.visible');
    });
  });
});
