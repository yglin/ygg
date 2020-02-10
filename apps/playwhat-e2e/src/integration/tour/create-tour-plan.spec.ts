import {
  TheThingImitation,
  ImitationsDataPath,
  TheThing
} from '@ygg/the-thing/core';
import { SiteNavigator } from '../../page-objects/site-navigator';
import { MockDatabase, login } from '@ygg/shared/test/cypress';
import { TourPlanViewPageObjectCypress } from '../../page-objects/tour';
import { TheThingEditorPageObjectCypress } from '@ygg/the-thing/test';
import { TourPlanTemplate, SampleTourPlan } from './tour-plan-template';

const tourPlanImitation = new TheThingImitation(TourPlanTemplate, {
  name: '遊程規劃單',
  description: '體驗組合的遊程規格，預定日期、時間、以及參加人數'
});

const siteNavigator = new SiteNavigator();
const mockDatabase = new MockDatabase();

describe('Create tour-plan', () => {
  before(() => {
    login().then(() => {
      mockDatabase.insert(
        `${TheThing.collection}/${TourPlanTemplate.id}`,
        TourPlanTemplate.toJSON()
      );
      mockDatabase.backupRTDB(ImitationsDataPath);
      mockDatabase
        .insertRTDB(
          `${ImitationsDataPath}/${tourPlanImitation.id}`,
          tourPlanImitation.toJSON()
        )
        .then(() => {
          cy.visit('/');
        });
    });
  });

  after(() => {
    mockDatabase.clear();
    mockDatabase.restoreRTDB();
  });

  it('Create a tour-plan from copy template', () => {
    // siteNavigator.goto(['the-things', 'create', 'tour-plan']);
    cy.visit(`/the-things/create/${tourPlanImitation.id}`);
    // cy.pause();
    const theThingEditorPO = new TheThingEditorPageObjectCypress();
    theThingEditorPO.expectVisible();
    // cy.pause();
    theThingEditorPO.extendValue(SampleTourPlan);
    theThingEditorPO.submit();
    const tourPlanViewPO = new TourPlanViewPageObjectCypress();
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(SampleTourPlan);
  });
});
