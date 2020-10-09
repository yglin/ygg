import {
  forgeItems,
  ImitationBox,
  ImitationBoxFlags,
  ImitationItem,
  ImitationItemCells,
  RelationshipBoxItem,
  RelationshipBoxMember
} from '@ygg/ourbox/core';
import { ItemWarehousePageObjectCypress } from '@ygg/ourbox/test';
import { GeoBound } from '@ygg/shared/geography/core';
import { generateID } from '@ygg/shared/infra/core';
import { Location } from '@ygg/shared/omni-types/core';
import { beforeAll, theMockDatabase } from '@ygg/shared/test/cypress';
import { User } from '@ygg/shared/user/core';
import { loginTestUser, testUsers } from '@ygg/shared/user/test';
import { forgeTags, Tag, TagsAccessor } from '@ygg/tags/core';
import { TagsControlPageObjectCypress } from '@ygg/tags/test';
import { TheThing } from '@ygg/the-thing/core';
import { orderBy, random, range, sortBy } from 'lodash';
import { SiteNavigator } from '../../support/site-navigator';

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
  const tagControlPO = new TagsControlPageObjectCypress(
    itemWarehousePO.theThingFinderPO.theThingFilterPO.getSelector()
  );

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

  const forgedTags = forgeTags({ count: 20 });
  const top10Tags = orderBy(forgedTags, ['popularity'], 'desc').slice(0, 10);
  const tag1: Tag = top10Tags[0];
  const tag2: Tag = top10Tags[1];
  const tag3: Tag = top10Tags[2];
  // console.debug(top10Tags);

  // =================== Forge items =======================
  const forgedItems: TheThing[] = forgeItems({ count: 10 });
  const itemsInPublicBox: TheThing[] = forgedItems.slice(0, 2);

  const itemsInMyBox: TheThing[] = forgedItems.slice(2, 4);

  const itemsInOtherBox: TheThing[] = forgedItems.slice(4, 6);

  const tagedItems = forgeItems({ count: 10 });
  const tag1Items = tagedItems.slice(0, 5);
  const tag2Items = tagedItems.slice(3, 7);
  const tag3Items = tagedItems.slice(7, 10);
  tag1Items.forEach(item => item.addTag(tag1.name));
  tag2Items.forEach(item => item.addTag(tag2.name));
  tag3Items.forEach(item => item.addTag(tag3.name));
  // console.debug(tagedItems.map(tagedItem => tagedItem.tags.tags));
  itemsInMyBox.push(...tagedItems);
  forgedItems.push(...tagedItems);

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
    beforeAll();
    theMockDatabase.insert(`${User.collection}/${me.id}`, me);
    cy.wrap(forgedTheThings).each((theThing: TheThing) => {
      theMockDatabase.insert(`${theThing.collection}/${theThing.id}`, theThing);
    });
    cy.wrap(forgedTags).each((tag: Tag) => {
      theMockDatabase.insert(`${Tag.collection}/${tag.id}`, tag);
    });
    cy.visit('/');
    loginTestUser(me);
    siteNavigator.gotoItemWarehouse();
    itemWarehousePO.expectVisible();
  });

  after(() => {
    theMockDatabase.clear();
  });

  it('Should show my manifest items in item-warehouse page', () => {
    itemWarehousePO.expectItems([...itemsInMyBox, ...itemsInPublicBox], {
      exact: true
    });
    itemWarehousePO.expectNotItems(itemsInOtherBox);
  });

  it('Filter items with tags', () => {
    // No filter tag, show all
    itemWarehousePO.expectItems([...itemsInMyBox, ...itemsInPublicBox], {
      exact: true
    });
    // Filter with each tag
    itemWarehousePO.setFilterTags([tag1.name]);
    itemWarehousePO.expectItems(tag1Items, {
      exact: true
    });
    itemWarehousePO.setFilterTags([tag2.name]);
    itemWarehousePO.expectItems(tag2Items, {
      exact: true
    });
    itemWarehousePO.setFilterTags([tag3.name]);
    itemWarehousePO.expectItems(tag3Items, {
      exact: true
    });

    // Filter with tag1 and tag2
    itemWarehousePO.setFilterTags([tag1.name, tag2.name]);
    itemWarehousePO.expectItems(tagedItems.slice(0, 7), {
      exact: true
    });

    // Filter with tag2 and tag3
    itemWarehousePO.setFilterTags([tag2.name, tag3.name]);
    itemWarehousePO.expectItems(tagedItems.slice(3, 10), {
      exact: true
    });

    // Clear filter tags, show all, again
    itemWarehousePO.setFilterTags([]);
    itemWarehousePO.expectItems([...itemsInMyBox, ...itemsInPublicBox], {
      exact: true
    });
  });

  it('Should show top 10 tags above', () => {
    tagControlPO.expectTopTags(top10Tags.map(tag => tag.name));
  });

  it('Filter with top tags', () => {
    tagControlPO.clickTopTag(tag1.name);
    itemWarehousePO.expectItems(tag1Items, {
      exact: true
    });

    tagControlPO.clickTopTag(tag1.name);
    tagControlPO.clickTopTag(tag2.name);
    itemWarehousePO.setFilterTags([tag2.name]);
    itemWarehousePO.expectItems(tag2Items, {
      exact: true
    });

    tagControlPO.clickTopTag(tag2.name);
    tagControlPO.clickTopTag(tag3.name);
    itemWarehousePO.expectItems(tag3Items, {
      exact: true
    });
  });
});
