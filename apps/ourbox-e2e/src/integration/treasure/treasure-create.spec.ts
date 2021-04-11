import { Box, Treasure } from '@ygg/ourbox/core';
import { TreasureEditPageObjectCypress } from '@ygg/ourbox/test';
import { Location } from '@ygg/shared/geography/core';
import { LocationControlPageObjectCypress } from '@ygg/shared/geography/test';
import { Album } from '@ygg/shared/omni-types/core';
import { logout, theMockDatabase } from '@ygg/shared/test/cypress';
import {
  EmceePageObjectCypress,
  ImageThumbnailListPageObjectCypress,
  ImageThumbnailSelectorPageObjectCypress,
  PageTitlePageObjectCypress,
  YggDialogPageObjectCypress
} from '@ygg/shared/ui/test';
import { User } from '@ygg/shared/user/core';
import { loginTestUser, testUsers } from '@ygg/shared/user/test';
import { range } from 'lodash';
import { createBox } from '../box/box-create';
import {
  addToBox,
  createTreasure,
  expectMyTreasure,
  gotoCreatePage,
  message,
  setTreasureData
} from './treasure-create';

describe('Create a treasure from the ground up', () => {
  const me = testUsers[0];
  const treasures = range(10).map(() => Treasure.forge());
  const boxMyDefault = Box.forge();
  boxMyDefault.name = `${me.name}的寶箱`;
  boxMyDefault.album = new Album(Box.thumbnailSrc);
  boxMyDefault.location = null;

  // const boxAllPublic = Box.forge();
  // boxAllPublic.name = `所有人的大寶箱`;
  // boxAllPublic.album = new Album(Box.thumbnailSrc);

  const boxMyOtherOne = Box.forge();

  // const box01 = Box.forge();
  const treasureEditPO = new TreasureEditPageObjectCypress();
  const treasuresPO = new ImageThumbnailListPageObjectCypress();
  const pageTitlePO = new PageTitlePageObjectCypress();
  const dialogPO = new YggDialogPageObjectCypress();
  // const boxEditPO = new BoxEditPageObjectCypress();

  const emceePO = new EmceePageObjectCypress();

  before(() => {
    cy.wrap(testUsers).each((user: User) => {
      theMockDatabase.insert(`${User.collection}/${user.id}`, user);
    });
    cy.visit('/');
    loginTestUser(me);
  });

  beforeEach(() => {
    gotoCreatePage();
  });

  after(() => {
    logout();
    theMockDatabase.clear();
  });

  it('Should show prompt for putting into box', () => {
    const treasure02 = treasures[1];
    createTreasure(treasure02);
    emceePO.cancel(message('confirmAddToBox', treasure02.name));
    expectMyTreasure(treasure02);
  });

  it('Create and put into my default box', () => {
    theMockDatabase.clearFromOwner(Box.collection, me.id);
    const treasure03 = treasures[2];
    createTreasure(treasure03);
    addToBox(treasure03, boxMyDefault);
    // emceePO.confirm(message('confirmAddToBox', treasure03.name));
    // const boxSelectorPO = new ImageThumbnailSelectorPageObjectCypress(
    //   dialogPO.getSelector()
    // );
    // dialogPO.expectTitle(message('selectBoxToStoreTreasure', treasure03));
    // boxSelectorPO.expectVisible();
    // boxSelectorPO.expectItem(boxMyDefault);
    // boxSelectorPO.selectItem(boxMyDefault);
    // dialogPO.confirm();
    // emceePO.info(
    //   message('putTreasureIntoBox', { treasure: treasure03, box: boxMyDefault })
    // );

    // Redircet to my default box page
    // Prompt user to set box location
    emceePO.confirm(message('boxShouldHaveLocation', { box: boxMyDefault }));
    dialogPO.expectTitle(message('inputBoxLocation', boxMyDefault));
    const locationControlPO = new LocationControlPageObjectCypress(
      dialogPO.getSelector()
    );
    locationControlPO.setValue(Location.forge());
    dialogPO.confirm();

    // Expect new treasure in the list
    pageTitlePO.expectText(`${boxMyDefault.name}`);
    treasuresPO.scrollIntoView();
    treasuresPO.expectVisible();
    treasuresPO.expectItem(treasure03);
  });

  it('Create and put into some new box', () => {
    const treasure04 = treasures[3];
    createTreasure(treasure04);
    emceePO.confirm(message('confirmAddToBox', treasure04.name));
    const boxSelectorPO = new ImageThumbnailSelectorPageObjectCypress(
      dialogPO.getSelector()
    );
    boxSelectorPO.expectVisible();
    dialogPO.expectTitle(message('selectBoxToStoreTreasure', treasure04));
    boxSelectorPO.gotoCreateNew();
    createBox(boxMyOtherOne);
    // Redirect to new box page after create
    pageTitlePO.expectText(`${boxMyOtherOne.name}`);
    boxSelectorPO.expectVisible();
    boxSelectorPO.expectItem(boxMyOtherOne);
    boxSelectorPO.selectItem(boxMyOtherOne);
    dialogPO.confirm();
    emceePO.info(
      message('putTreasureIntoBox', {
        treasure: treasure04,
        box: boxMyOtherOne
      })
    );

    // Expect new treasure in the list
    pageTitlePO.expectText(`${boxMyOtherOne.name}`);
    treasuresPO.scrollIntoView();
    treasuresPO.expectVisible();
    treasuresPO.expectItem(treasure04);
  });

  it('Should request login if not yet', () => {
    logout();
    const treasure01 = treasures[0];
    setTreasureData(treasure01);
    treasureEditPO.submit();
    emceePO.info(`新增寶物前請先登入帳號`);
    loginTestUser(me, { openLoginDialog: false });
    emceePO.info(message('createSuccess', treasure01.name));
    // Skip putting into box
    emceePO.cancel();
    expectMyTreasure(treasure01);
  });
});
