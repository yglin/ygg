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
import { MapSearchPageObjectCypress, ItemWarehousePageObjectCypress } from '@ygg/ourbox/test';
import { Location } from '@ygg/shared/omni-types/core';
import { loginTestUser, testUsers } from '@ygg/shared/user/test';

describe('Search items in warehouse page', () => {
  // Page objects
  const siteNavigator = new SiteNavigator();
  // const mapSearchPO = new MapSearchPageObjectCypress();
  // const myHeldItemsPO = new MyHeldItemsPageObjectCypress();
  // const itemPO = new ItemPageObjectCypress();
  // const itemTransferPO = new ItemTransferPageObjectCypress();
  // const emceePO = new EmceePageObjectCypress();
  // const accountWidgetPO = new AccountWidgetPageObjectCypress();
  // const myNotificationsPO = new MyNotificationListPageObjectCypress();
  // const myItemTransfersPO = new MyItemTransfersPageObjectCypress();
  const itemWarehousePO = new ItemWarehousePageObjectCypress();

  const me: User = testUsers[0];

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
  forgedItems.push(...itemsInPublicBox);

  const itemsInMyBox: TheThing[] = range(2).map(() =>
    ImitationItem.forgeTheThing()
  );
  forgedItems.push(...itemsInMyBox);

  const itemsInOtherBox: TheThing[] = range(2).map(() =>
    ImitationItem.forgeTheThing()
  );
  forgedItems.push(...itemsInOtherBox);

  forgedItems.forEach(item => {
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
  boxMy.setFlag(ImitationBoxFlags.isPublic.id, false);
  itemsInMyBox.forEach(item => {
    boxMy.addRelation(RelationshipBoxItem.createRelation(boxMy.id, item.id));
  });
  boxMy.addUsersOfRole(RelationshipBoxMember.role, [me.id]);
  forgedBoxes.push(boxMy);

  const boxOther: TheThing = ImitationBox.forgeTheThing();
  boxOther.setFlag(ImitationBoxFlags.isPublic.id, false);
  itemsInOtherBox.forEach(item => {
    boxOther.addRelation(
      RelationshipBoxItem.createRelation(boxOther.id, item.id)
    );
  });
  forgedBoxes.push(boxOther);

  // To avoid name conflict
  forgedItems.forEach((item, index) => {
    item.name += `_${index}`;
  });
  forgedTheThings.push(...forgedItems);
  forgedTheThings.push(...forgedBoxes);

  before(() => {
    theMockDatabase.insert(`${User.collection}/${me.id}`, me);
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

  it('Should show my manifest items in item-warehouse page', () => {
    siteNavigator.gotoItemWarehouse();
    itemWarehousePO.expectVisible();
    itemWarehousePO.expectItems([...itemsInMyBox, ...itemsInPublicBox]);
    itemWarehousePO.expectNotItems(itemsInOtherBox);
  });
});
