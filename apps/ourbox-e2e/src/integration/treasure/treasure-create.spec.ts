import {
  HeaderPageObjectCypress,
  TreasureEditPageObjectCypress
} from '@ygg/ourbox/test';
import { SideDrawerPageObjectCypress } from '@ygg/shared/ui/test';

describe('Create a treasure from the ground up', () => {
  const headerPO = new HeaderPageObjectCypress();
  const sideDrawerPO = new SideDrawerPageObjectCypress();
  const treasureEditPO = new TreasureEditPageObjectCypress();

  before(() => {
    cy.visit('/');
  });

  it('Navigate to creating page from link in side menu', () => {
    headerPO.openSideDrawer();
    sideDrawerPO.expectVisible();
    sideDrawerPO.clickAction('create-treasure');
    treasureEditPO.expectVisible();
  });

  // it('Fill required data', () => {});

  // it('Ask for login before submit', () => {});

  // it('Create a default box of user', () => {});

  // it('Navigate to the default box, the treasure should be there', () => {});

  // it('Navigate to the treasure, check data consistency', () => {});
});
