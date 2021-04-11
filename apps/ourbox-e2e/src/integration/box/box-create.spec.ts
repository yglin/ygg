import { Box, Treasure } from '@ygg/ourbox/core';
import { range } from 'lodash';
import { createBox, gotoCreatePage as gotoBoxCreatePage } from './box-create';
import { MapNavigatorPageObjectCypress } from '@ygg/shared/geography/test';
import {
  BoxViewPageObjectCypress,
  TreasureViewPageObjectCypress
} from '@ygg/ourbox/test';
import { gotoMyBoxes } from './box';
import {
  ImageThumbnailListPageObjectCypress,
  YggDialogPageObjectCypress
} from '@ygg/shared/ui/test';
import { loginTestUser, testUsers } from '@ygg/shared/user/test';
import { User } from '@ygg/shared/user/core';
import { logout, theMockDatabase } from '@ygg/shared/test/cypress';
import { gotoMapNavigatorPage } from '../map/map';
import { addToBox, createTreasure } from '../treasure/treasure-create';

describe('Create box', () => {
  const boxes = range(10).map(() => Box.forge());

  const mapNavigatorPO = new MapNavigatorPageObjectCypress();
  const boxViewPO = new BoxViewPageObjectCypress();
  const myBoxesPO = new ImageThumbnailListPageObjectCypress();
  const dialogPO = new YggDialogPageObjectCypress();
  const treasureViewPO = new TreasureViewPageObjectCypress();

  const me = testUsers[0];

  before(() => {
    cy.wrap(testUsers).each((user: User) => {
      theMockDatabase.insert(`${User.collection}/${user.id}`, user);
    });
    cy.visit('/');
    loginTestUser(me);
  });

  beforeEach(() => {});

  after(() => {
    logout();
    theMockDatabase.clear();
  });

  it('Create a private box', () => {
    const boxPrivate = boxes[0];
    boxPrivate.public = false;
    // Navigate to box create page
    gotoBoxCreatePage();

    // Set box values and submit
    createBox(boxPrivate);
    boxViewPO.expectVisible();

    // Expect data consistency
    boxViewPO.expectValue(boxPrivate);

    // Go to my boxes
    gotoMyBoxes();

    // Expect the new box
    myBoxesPO.expectItem(boxPrivate);

    // Go to the created box
    myBoxesPO.clickItem(boxPrivate);

    // Expect data consistency
    boxViewPO.expectValue(boxPrivate);

    // Go to map-navigator page
    gotoMapNavigatorPage();

    // Pan to box's location
    mapNavigatorPO.panTo(boxPrivate.location);

    // Box should not show on map
    mapNavigatorPO.expectNoItem(boxPrivate);
  });

  it('Create a public box', () => {
    const boxPublic = boxes[1];
    boxPublic.public = true;
    // Navigate to box create page
    gotoBoxCreatePage();

    // Set box values and submit
    createBox(boxPublic);

    // Should redirect to box view page
    boxViewPO.expectVisible();
    boxViewPO.expectValue(boxPublic);

    // Go to map-navigator page
    gotoMapNavigatorPage();

    // Pan to box's location
    mapNavigatorPO.panTo(boxPublic.location);

    // Box should show on map
    mapNavigatorPO.expectItem(boxPublic);
  });

  it('Put treasure in public box', () => {
    const boxPublic01 = boxes[2];
    boxPublic01.public = true;
    const treasure01 = Treasure.forge();
    // Navigate to box create page
    gotoBoxCreatePage();

    // Set box values and submit
    createBox(boxPublic01);
    boxViewPO.expectVisible();
    boxViewPO.expectValue(boxPublic01);

    // Create trasure
    createTreasure(treasure01);

    // Select the box to put treasure
    addToBox(treasure01, boxPublic01);
    boxViewPO.expectVisible();

    // Redirect to map page
    gotoMapNavigatorPage();

    // Click on map marker of the public box
    mapNavigatorPO.panTo(boxPublic01.location);
    mapNavigatorPO.clickItem(boxPublic01);

    // Should show treasure in pop-up treasure list
    dialogPO.expectTitle(`${boxPublic01.name} 裡的寶物`);
    const treasureListPO = new ImageThumbnailListPageObjectCypress(
      dialogPO.getSelector()
    );
    treasureListPO.expectItem(treasure01);

    // Click on teh treasure redirect to its page
    treasureListPO.clickItem(treasure01);
    dialogPO.expectClosed();
    treasureViewPO.expectVisible();
    treasureViewPO.expectValue(treasure01);
  });
});
