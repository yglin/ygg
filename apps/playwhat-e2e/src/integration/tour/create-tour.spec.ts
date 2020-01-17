import * as SampleTourJSON from './sample-tour.json';
import { TheThing } from '@ygg/the-thing/core';
import { MockDatabase, login } from '@ygg/shared/test/cypress';
import {
  TheThingEditorPageObjectCypress,
  getCreatedTheThingId,
  TheThingViewPageObjectCypress
} from '@ygg/the-thing/test';

const mockDatabase = new MockDatabase();
const sampleTour = new TheThing().fromJSON(SampleTourJSON.tour);
const plays = SampleTourJSON.plays.map(playJSON =>
  new TheThing().fromJSON(playJSON)
);
const relationPlay = '體驗';

describe('Create a tour composed of plays', () => {
  before(() => {
    login();
    cy.visit('/');
  });

  after(() => {
    mockDatabase.clear();
  });

  it('Create sample tour and check data consistency', () => {
    cy.visit('/the-things/create');
    const theThingEditorPO = new TheThingEditorPageObjectCypress();
    theThingEditorPO.setValue(sampleTour);
    cy.wrap(plays).each((play: any) => {
      theThingEditorPO.addRelationAndGotoCreate(relationPlay);
      theThingEditorPO.setValue(play);
      theThingEditorPO.submit();
      getCreatedTheThingId(play.id).then(playId => {
        play.id = playId;
        mockDatabase.pushDocument(`${TheThing.collection}/${playId}`, play.toJSON());
        const theThingViewPO = new TheThingViewPageObjectCypress();
        theThingViewPO.expectValue(play);
  
        theThingViewPO.linkRelationBack();
        theThingEditorPO.expectVisible();
      });
    });
    theThingEditorPO.submit();
    getCreatedTheThingId().then(id => {
      mockDatabase.pushDocument(`${TheThing.collection}/${id}`, SampleTourJSON);
      const theThingViewPO = new TheThingViewPageObjectCypress();
      theThingViewPO.expectValue(sampleTour);
      theThingViewPO.expectRelations(relationPlay, plays);
    });
  });
});
