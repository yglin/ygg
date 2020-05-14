import { sampleSize, random } from 'lodash';
import { login, theMockDatabase } from '@ygg/shared/test/cypress';
import {
  LoginDialogPageObjectCypress,
  waitForLogin
} from '@ygg/shared/user/test';
import {
  MinimalTourPlan,
  TourPlanFull,
  // TourPlanFullWithPlays,
  MinimalTourPlanWithoutName,
  TourPlanWithPlaysNoAddition,
  TourPlanWithPlaysAndAdditions
} from './sample-tour-plan';
import { SamplePlays, SampleAdditions } from '../play/sample-plays';
import {
  TheThingDataTablePageObjectCypress,
  MyThingsDataTablePageObjectCypress,
  MyThingsPageObjectCypress
} from '@ygg/the-thing/test';
import {
  TourPlanViewPageObjectCypress,
  TourPlanBuilderPageObjectCypress,
  TourPlanAdminPageObjectCypress
} from '@ygg/playwhat/test';
import { SiteNavigator } from '@ygg/playwhat/test';
import { TheThing, TheThingCell, TheThingRelation } from '@ygg/the-thing/core';
import {
  ImitationOrder,
  Purchase,
  RelationNamePurchase
} from '@ygg/shopping/core';
import {
  ContactControlPageObjectCypress,
  OmniTypeViewControlPageObjectCypress
} from '@ygg/shared/omni-types/test';
import { User } from '@ygg/shared/user/core';
import { Contact, DateRange } from '@ygg/shared/omni-types/core';
import {
  defaultTourPlanName,
  CellNames,
  ImitationTourPlan,
  ImitationPlay
} from '@ygg/playwhat/core';
import { randomBytes } from 'crypto';
import {
  YggDialogPageObjectCypress,
  EmceePageObjectCypress
} from '@ygg/shared/ui/test';
import { IPurchasePack } from '@ygg/shopping/ui';

describe('Tour-plan builder', () => {
  const siteNavigator = new SiteNavigator();
  const SampleThings = SamplePlays.concat(SampleAdditions);

  const tourPlanBuilderPO = new TourPlanBuilderPageObjectCypress();
  const tourPlanViewPO = new TourPlanViewPageObjectCypress();
  const tourPlanAdminPO = new TourPlanAdminPageObjectCypress();
  const myTourPlansPO = new MyThingsDataTablePageObjectCypress();
  let currentUser: User;

  before(() => {
    login().then(user => {
      currentUser = user;
      cy.wrap(SampleThings).each((thing: any) => {
        thing.ownerId = user.id;
        theMockDatabase.insert(`${TheThing.collection}/${thing.id}`, thing);
      });
      cy.visit('/');
    });
  });

  beforeEach(() => {
    cy.visit('/');
    waitForLogin();
    tourPlanViewPO.expectVisible();
    // tourPlanBuilderPO.reset();
    // siteNavigator.goto(['tour-plans', 'builder'], tourPlanBuilderPO);
  });

  after(() => {
    // Goto my-things page and delete all test things
    const myThingsPO = new MyThingsPageObjectCypress();
    siteNavigator.goto(['the-things', 'my'], myThingsPO);
    cy.wait(3000);
    myThingsPO.deleteAll();
    theMockDatabase.clear();
  });

  it('Build a tour-plan, book a few plays', () => {
    tourPlanViewPO.setValue(TourPlanWithPlaysNoAddition, {
      freshNew: true
    });
    tourPlanViewPO.save(TourPlanWithPlaysNoAddition);

    // Expect redirect to tour-plan view page, and check selected plays
    tourPlanViewPO.expectShowAsPage();
    tourPlanViewPO.expectValue(TourPlanWithPlaysNoAddition);
  });

  it('Book a few plays, then fill the tour-plan', () => {});

  it('Book a few plays with additions', () => {
    tourPlanBuilderPO.setValue(TourPlanWithPlaysAndAdditions);
    tourPlanBuilderPO.tourPlanPreviewPO.save(TourPlanWithPlaysAndAdditions);

    // Expect redirect to tour-plan view page, and check selected plays
    tourPlanViewPO.expectShowAsPage();
    tourPlanViewPO.expectValue(TourPlanWithPlaysAndAdditions);
  });
});
