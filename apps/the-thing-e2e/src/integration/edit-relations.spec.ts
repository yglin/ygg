import {
  TheThing,
  TheThingCell,
  RelationDef,
  ImitationsDataPath
} from '@ygg/the-thing/core';
import { login, MockDatabase } from '@ygg/shared/test/cypress';
import { littlePenguin, kiwi, kakapo } from './australia-birbs';
import {
  Sam,
  Frodo,
  Gollum,
  ImitationFrodo,
  relationGollumToFrodo,
  relationSamToGollum,
  ImitationGollum
} from './hobbits';
import {
  TheThingEditorPageObjectCypress,
  TheThingViewPageObjectCypress,
  getCreatedTheThingId
} from '@ygg/the-thing/test';

const mockDatabase = new MockDatabase();

describe('Edit relations to other the-things', () => {
  before(() => {
    login().then(user => {
      mockDatabase.insert(`${TheThing.collection}/${Sam.id}`, Sam.toJSON());
      mockDatabase.insert(
        `${TheThing.collection}/${Gollum.id}`,
        Gollum.toJSON()
      );
      mockDatabase.backupRTDB(ImitationsDataPath);
      mockDatabase.insertRTDB(
        `${ImitationsDataPath}/${ImitationFrodo.id}`,
        ImitationFrodo.toJSON()
      );
      mockDatabase.insertRTDB(
        `${ImitationsDataPath}/${ImitationGollum.id}`,
        ImitationGollum.toJSON()
      );
      cy.visit('/');
    });
  });

  after(() => {
    mockDatabase.clear();
    mockDatabase.restoreRTDB();
  });

  beforeEach(function() {
    mockDatabase.insert(`${TheThing.collection}/${Frodo.id}`, Frodo.toJSON());
  });

  it('Can remove certain relation', () => {
    const relationName = 'Dumb ass followers';
    Frodo.addRelations(relationName, [Sam, Gollum]);
    mockDatabase.upsert(`${TheThing.collection}/${Frodo.id}`, Frodo.toJSON());
    cy.visit(`the-things/${Frodo.id}/edit`);
    const theThingEditorPO = new TheThingEditorPageObjectCypress();
    theThingEditorPO.expectVisible();
    theThingEditorPO.removeRelation(relationName, Sam);
    theThingEditorPO.submit();
    const theThingViewPO = new TheThingViewPageObjectCypress();
    theThingViewPO.expectVisible();
    // The relation to kiwi removed,
    // should not see kiwi in the relation objects any more
    theThingViewPO.expectNoRelationObject(relationName, Sam);
    cy.go('back');
    theThingEditorPO.expectVisible();
    theThingEditorPO.removeRelation(relationName, Gollum);
    theThingEditorPO.submit();
    theThingViewPO.expectVisible();
    // Both relation objects, kiwi and littlePenguin, are removed,
    // The entire relation should be gone
    theThingViewPO.expectNoRelation(relationName);
  });

  it('Create a relation, link to another the-thing', () => {
    cy.visit(`/the-things/${Frodo.id}/edit`);
    const relationToSam = 'dirty thief covet my precious';
    const theThingEditorPO = new TheThingEditorPageObjectCypress();
    theThingEditorPO.expectVisible();
    theThingEditorPO.setValue(Frodo);
    theThingEditorPO.addRelationExist(relationToSam, Sam);
    theThingEditorPO.submit();

    const FrodoViewPO = new TheThingViewPageObjectCypress();
    FrodoViewPO.expectVisible();
    FrodoViewPO.expectRelation(relationToSam, Sam);
  });

  it('Create a relation object on the fly', () => {
    cy.visit(`/the-things/${Frodo.id}/edit`);

    const theThingEditorPO = new TheThingEditorPageObjectCypress();
    theThingEditorPO.expectVisible();
    theThingEditorPO.addRelationAndGotoCreate(relationGollumToFrodo.name);

    // Now should be the second-level creation page
    theThingEditorPO.setValue(Gollum);

    theThingEditorPO.addRelationAndGotoCreate(relationSamToGollum.name);
    // cy.pause();
    // Third level creation page
    theThingEditorPO.setValue(Sam);
    theThingEditorPO.submit();
    // cy.pause();

    // Back to second level
    theThingEditorPO.expectValue(Gollum);
    theThingEditorPO.expectRelation(relationSamToGollum.name, Sam);
    theThingEditorPO.submit();

    // Back to the originla the-thing
    theThingEditorPO.expectValue(Frodo);
    theThingEditorPO.expectRelation(relationGollumToFrodo.name, Gollum);
    theThingEditorPO.submit();

    const theThingViewPO = new TheThingViewPageObjectCypress();
    theThingViewPO.expectVisible();
    theThingViewPO.expectValue(Frodo);
    theThingViewPO.expectRelation(relationGollumToFrodo.name, Gollum);
    // theThingViewPO.expectNotLinkRelationBack();
  });

  it('In creation of relation object, expect related imitation applied', () => {
    cy.visit(`/the-things/create?imitation=${ImitationFrodo.id}`);
    const theThingEditorPO = new TheThingEditorPageObjectCypress();
    theThingEditorPO.expectVisible();
    theThingEditorPO.expectRelation(relationGollumToFrodo.name);
    theThingEditorPO.addRelationAndGotoCreate(relationGollumToFrodo.name);
    theThingEditorPO.expectRelation(relationSamToGollum.name);
  });

  it('Cancel create relation object on-the-fly', () => {
    cy.visit(`/the-things/${Frodo.id}/edit`);

    const theThingEditorPO = new TheThingEditorPageObjectCypress();
    theThingEditorPO.expectVisible();
    theThingEditorPO.addRelationAndGotoCreate(relationGollumToFrodo.name);
    theThingEditorPO.expectRelationHint(relationGollumToFrodo.name, Frodo.name);
    theThingEditorPO.cancelRelationCreate();
    theThingEditorPO.expectValue(Frodo);
  });
});
