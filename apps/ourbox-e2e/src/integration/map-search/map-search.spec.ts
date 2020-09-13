import { GeoBound } from '@ygg/shared/geography/core';
import { range, random } from 'lodash';
import {
  ImitationItem,
  ImitationBox,
  ImitationBoxFlags,
  RelationshipBoxItem,
  RelationshipBoxMember,
  ImitationItemCells
} from '@ygg/ourbox/core';
import { TheThing } from '@ygg/the-thing/core';
import { User } from '@ygg/shared/user/core';
import {
  theMockDatabase,
  logout as logoutBackground
} from '@ygg/shared/test/cypress';
import { SiteNavigator } from '../../support/site-navigator';
import {
  BoxViewPageObjectCypress,
  ItemPageObjectCypress,
  MapSearchPageObjectCypress,
  MyBoxesPageObjectCypress
} from '@ygg/ourbox/test';
import { Location } from '@ygg/shared/omni-types/core';
import { logout, loginTestUser } from '@ygg/shared/user/test';

describe('Search items on map', () => {
  // Page objects
  const siteNavigator = new SiteNavigator();
  const mapSearchPO = new MapSearchPageObjectCypress();
  const myBoxesPO = new MyBoxesPageObjectCypress();
  const boxViewPO = new BoxViewPageObjectCypress();
  // const myHeldItemsPO = new MyHeldItemsPageObjectCypress();
  const itemPO = new ItemPageObjectCypress();
  // const itemTransferPO = new ItemTransferPageObjectCypress();
  // const emceePO = new EmceePageObjectCypress();
  // const accountWidgetPO = new AccountWidgetPageObjectCypress();
  // const myNotificationsPO = new MyNotificationListPageObjectCypress();
  // const myItemTransfersPO = new MyItemTransfersPageObjectCypress();

  const me: User = User.forge();
  const anotherboxMember: User = User.forge();

  const mapBound1: GeoBound = new GeoBound({
    north: 23.93688,
    east: 120.731635,
    south: 23.896002,
    west: 120.624432
  });

  const mapBound2: GeoBound = new GeoBound({
    north: 24.094448,
    east: 120.59928,
    south: 24.052196,
    west: 120.508758
  });

  function placeItemInBound(item: TheThing, bound: GeoBound) {
    const latitude = random(bound.south, bound.north, true);
    const longitude = random(bound.west, bound.east, true);
    const oldLocation: Location = item.getCellValue(
      ImitationItemCells.location.id
    ).value;
    let newLocation: Location;
    if (Location.isLocation(oldLocation)) {
      newLocation = oldLocation.clone();
    } else {
      newLocation = new Location();
    }
    newLocation.geoPoint.setCoordinates(latitude, longitude);
    item.setCellValue(ImitationItemCells.location.id, newLocation);
  }

  const forgedTheThings: TheThing[] = [];

  // =================== Forge items =======================
  const forgedItems: TheThing[] = [];
  const itemsInPublicBox: TheThing[] = range(2).map(() =>
    ImitationItem.forgeTheThing()
  );
  placeItemInBound(itemsInPublicBox[0], mapBound1);
  placeItemInBound(itemsInPublicBox[1], mapBound2);
  forgedItems.push(...itemsInPublicBox);

  const itemsInMyBox: TheThing[] = range(2).map(() =>
    ImitationItem.forgeTheThing()
  );
  placeItemInBound(itemsInMyBox[0], mapBound1);
  placeItemInBound(itemsInMyBox[1], mapBound2);
  forgedItems.push(...itemsInMyBox);

  const itemsInOtherBox: TheThing[] = range(2).map(() =>
    ImitationItem.forgeTheThing()
  );
  placeItemInBound(itemsInOtherBox[0], mapBound1);
  placeItemInBound(itemsInOtherBox[1], mapBound2);
  forgedItems.push(...itemsInOtherBox);

  forgedItems.forEach((item, index) => {
    item.name += `_${index}`;
    item.setState(ImitationItem.stateName, ImitationItem.states.available);
  });

  // ======================== Forge boxes ========================
  const forgedBoxes: TheThing[] = [];
  const boxPublic: TheThing = ImitationBox.forgeTheThing();
  boxPublic.setFlag(ImitationBoxFlags.isPublic.id, true);
  itemsInPublicBox.forEach(item => {
    boxPublic.addRelation(
      RelationshipBoxItem.createRelation(boxPublic.id, item.id)
    );
  });
  forgedBoxes.push(boxPublic);

  const boxMy: TheThing = ImitationBox.forgeTheThing();
  boxMy.ownerId = me.id;
  boxMy.setState(ImitationBox.stateName, ImitationBox.states.open);
  boxMy.setFlag(ImitationBoxFlags.isPublic.id, false);
  itemsInMyBox.forEach(item => {
    boxMy.addRelation(RelationshipBoxItem.createRelation(boxMy.id, item.id));
  });
  boxMy.addUsersOfRole(RelationshipBoxMember.role, [
    me.id,
    anotherboxMember.id
  ]);
  forgedBoxes.push(boxMy);

  const boxOther: TheThing = ImitationBox.forgeTheThing();
  boxOther.setFlag(ImitationBoxFlags.isPublic.id, false);
  itemsInOtherBox.forEach(item => {
    boxOther.addRelation(
      RelationshipBoxItem.createRelation(boxOther.id, item.id)
    );
  });
  forgedBoxes.push(boxOther);

  forgedTheThings.push(...forgedItems);
  forgedTheThings.push(...forgedBoxes);

  before(() => {
    theMockDatabase.insert(`${User.collection}/${me.id}`, me);
    theMockDatabase.insert(
      `${User.collection}/${anotherboxMember.id}`,
      anotherboxMember
    );
    cy.wrap(forgedTheThings).each((theThing: TheThing) => {
      theMockDatabase.insert(`${theThing.collection}/${theThing.id}`, theThing);
    });
    logoutBackground().then(() => {
      cy.visit('/');
      loginTestUser(me);
    });
  });

  after(() => {
    theMockDatabase.clear();
  });

  it('Should show my manifest items in map bound', () => {
    siteNavigator.gotoMapSearch();
    mapSearchPO.expectVisible();

    mapSearchPO.setMapBound(mapBound1);
    // Wait for query
    cy.wait(3000);
    mapSearchPO.expectItems([itemsInPublicBox[0], itemsInMyBox[0]]);
    mapSearchPO.expectNotItems([
      itemsInPublicBox[1],
      itemsInMyBox[1],
      ...itemsInOtherBox
    ]);

    mapSearchPO.setMapBound(mapBound2);
    // Wait for query
    cy.wait(3000);
    mapSearchPO.expectItems([itemsInPublicBox[1], itemsInMyBox[1]]);
    mapSearchPO.expectNotItems([
      itemsInPublicBox[0],
      itemsInMyBox[0],
      ...itemsInOtherBox
    ]);
  });

  it('Should show created available item on map', () => {
    const testItemCreated = ImitationItem.forgeTheThing();
    placeItemInBound(testItemCreated, mapBound1);
    siteNavigator.gotoMyBoxes();
    myBoxesPO.gotoBox(boxMy);
    boxViewPO.theThingPO.runAction(ImitationBox.actions['create-item']);
    itemPO.expectVisible();
    itemPO.createItem(testItemCreated, { makeAvailable: true });
    boxViewPO.expectVisible();
    cy.wait(1000);
    boxViewPO.expectItemAvailable(testItemCreated);

    siteNavigator.gotoMapSearch();
    mapSearchPO.expectVisible();
    mapSearchPO.setMapBound(mapBound1);
    // Wait for query
    cy.wait(3000);
    // Me can see the created Item
    mapSearchPO.expectItems([testItemCreated]);

    logout();
    loginTestUser(anotherboxMember);
    // Wait for re-fetch data
    cy.wait(3000);
    // Another box member can see the created Item
    mapSearchPO.expectItems([testItemCreated]);
  });
});
