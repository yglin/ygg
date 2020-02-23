import { TheThing, TheThingCell } from '@ygg/the-thing/core';
import { Album, Image } from '@ygg/shared/types';
import { login, MockDatabase } from '@ygg/shared/test/cypress';
import { littlePenguin, kiwi, kakapo } from './australia-birbs';
import { Sam, Frodo, Gollum } from './hobbits';
import {
  TheThingEditorPageObjectCypress,
  TheThingViewPageObjectCypress,
  getCreatedTheThingId
} from '@ygg/the-thing/test';

const mockDatabase = new MockDatabase();

describe('Edit relations to other the-things', () => {
  before(() => {
    login();
    mockDatabase.insert(`${TheThing.collection}/${Sam.id}`, Sam.toJSON());
    mockDatabase.insert(`${TheThing.collection}/${Gollum.id}`, Gollum.toJSON());
  });

  after(() => {
    mockDatabase.clear();
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
    const relationFrodoToGollum = 'Psychopath keeps calling me master';
    // Set relation name "Save my sorry ass", and go-to creation of "Doraemon"
    theThingEditorPO.addRelationAndGotoCreate(relationFrodoToGollum);
    // cy.pause();
    // Now should be the second-level creation page
    theThingEditorPO.setValue(Gollum);

    const relationGollumToSam = "Master's gay fwend";
    theThingEditorPO.addRelationAndGotoCreate(relationGollumToSam);
    // cy.pause();
    // Third level creation page
    theThingEditorPO.setValue(Sam);
    theThingEditorPO.submit();
    // cy.pause();

    // Back to second level
    theThingEditorPO.expectValue(Gollum);
    theThingEditorPO.expectRelation(relationGollumToSam, Sam);
    theThingEditorPO.submit();

    // Back to the originla the-thing
    theThingEditorPO.expectValue(Frodo);
    theThingEditorPO.expectRelation(relationFrodoToGollum, Gollum);
    theThingEditorPO.submit();

    const theThingViewPO = new TheThingViewPageObjectCypress();
    theThingViewPO.expectVisible();
    theThingViewPO.expectValue(Frodo);
    theThingViewPO.expectRelation(relationFrodoToGollum, Gollum);
    // theThingViewPO.expectNotLinkRelationBack();
  });

  it('Cancel create relation object on-the-fly', () => {
    cy.visit(`/the-things/${Frodo.id}/edit`);

    const theThingEditorPO = new TheThingEditorPageObjectCypress();
    theThingEditorPO.expectVisible();
    const relationFrodoToGollum = 'Psychopath keeps calling me master';
    // Set relation name "Save my sorry ass", and go-to creation of "Doraemon"
    theThingEditorPO.addRelationAndGotoCreate(relationFrodoToGollum);
    theThingEditorPO.expectRelationHint(relationFrodoToGollum, Frodo.name);
    theThingEditorPO.cancelRelationCreate();
    theThingEditorPO.expectValue(Frodo);    
  });
  
});
