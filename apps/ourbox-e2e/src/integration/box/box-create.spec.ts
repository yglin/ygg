import { Box } from '@ygg/ourbox/core';
import { range } from 'lodash';
import { createBox, gotoCreatePage as gotoBoxCreatePage } from './box-create';
import { MapNavigatorPageObjectCypress } from '@ygg/shared/geography/test';
import { BoxViewPageObjectCypress } from '@ygg/ourbox/test';
import { gotoMyBoxes } from './box';
import { ImageThumbnailListPageObjectCypress } from '@ygg/shared/ui/test';
import { loginTestUser, testUsers } from '@ygg/shared/user/test';
import { User } from '@ygg/shared/user/core';
import { logout, theMockDatabase } from '@ygg/shared/test/cypress';

describe('Create box', () => {
  const boxes = range(10).map(() => Box.forge());

  // const mapNavigatorPO = new MapNavigatorPageObjectCypress();
  const boxViewPO = new BoxViewPageObjectCypress();
  const myBoxesPO = new ImageThumbnailListPageObjectCypress();

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
    const box01 = boxes[0];
    box01.public = false;
    // Navigate to box create page
    gotoBoxCreatePage();

    // Set box values and submit
    createBox(box01);

    // Go to my boxes
    gotoMyBoxes();
    myBoxesPO.expectItem(box01);

    // Go to the created box
    myBoxesPO.clickItem(box01);
    boxViewPO.expectVisible();

    // Expect data consistency
    boxViewPO.expectValue(box01);
  });

  // it('Create a public box', () => {
  //   // Navigate to box create page
  //   // Set box values
  //   // Redirect to map page
  //   // Should show on map
  // });

  // it('Put treasure in public box', () => {
  //   // Navigate to box create page
  //   // Set box values and submit
  //   // Navigate to treasure create page
  //   // Set treasure values and submit
  //   // Select the public box to put treasure
  //   // Redirect to map page
  //   // Click on map marker of the public box
  //   // Should show treasure in pop-up treasure list
  // });
});
