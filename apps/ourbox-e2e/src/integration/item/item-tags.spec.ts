import {
  ImitationItem,
  ImitationBox,
  RelationshipBoxMember,
  RelationshipBoxItem,
  forgeItems
} from '@ygg/ourbox/core';
import {
  ItemPageObjectCypress,
  MyBoxesPageObjectCypress,
  BoxViewPageObjectCypress,
  ItemWarehousePageObjectCypress
} from '@ygg/ourbox/test';
import { SiteNavigator } from '../../support/site-navigator';
import { User } from '@ygg/shared/user/core';
import { beforeAll, theMockDatabase } from '@ygg/shared/test/cypress';
import { RelationRecord } from '@ygg/the-thing/core';
import { loginTestUser, testUsers } from '@ygg/shared/user/test';
import { forgeTags, Tag, Tags } from '@ygg/tags/core';
import { at, random, range, sampleSize } from 'lodash';
import { YggDialogPageObjectCypress } from '@ygg/shared/ui/test';
import {
  TagsControlPageObjectCypress,
  TagsViewPageObjectCypress
} from '@ygg/tags/test';

describe('Add tags to item and filter with tags', () => {
  const siteNavigator = new SiteNavigator();
  const myBoxesPO = new MyBoxesPageObjectCypress();
  const boxViewPO = new BoxViewPageObjectCypress();
  const itemPO = new ItemPageObjectCypress();
  const itemWarehousePO = new ItemWarehousePageObjectCypress();
  const tagControlPO = new TagsControlPageObjectCypress(
    itemWarehousePO.theThingFinderPO.theThingFilterPO.getSelector()
  );

  const testUser = testUsers[0];
  const testBox = ImitationBox.forgeTheThing();
  testBox.ownerId = testUser.id;
  testBox.setState(ImitationBox.stateName, ImitationBox.states.open);
  testBox.addUsersOfRole(RelationshipBoxMember.role, [testUser.id]);
  const testItems = forgeItems({ count: 6 });
  const testItem1 = testItems[0];
  const testItem2 = testItems[1];
  const testItem3 = testItems[2];

  const forgedTags = forgeTags({ count: 20 });
  // Make sure forged tags ordered by popularity and all with difference 1
  for (let index = 0; index < forgedTags.length; index++) {
    const tag = forgedTags[index];
    tag.fromJSON({ popularity: 1000 - index });
  }
  testItem1.setTags(new Tags(at(forgedTags, [0, 2, 3]).map(t => t.name)));
  const top10Tags = forgedTags.slice(0, 10);
  const tag10 = forgedTags[9];
  const tag11 = forgedTags[10];

  before(() => {
    beforeAll();
    theMockDatabase.insert(`${User.collection}/${testUser.id}`, testUser);
    theMockDatabase.insert(`${testBox.collection}/${testBox.id}`, testBox);
    cy.wrap(forgedTags).each((tag: Tag) => {
      theMockDatabase.insert(`${Tag.collection}/${tag.id}`, tag);
    });
    // theMockDatabase.insert(`${testItem.collection}/${testItem.id}`, testItem);
    cy.visit('/');
    loginTestUser(testUser);
    siteNavigator.gotoMyBoxes();
    myBoxesPO.expectVisible();
    myBoxesPO.gotoBox(testBox);
    boxViewPO.expectVisible();
  });

  after(() => {
    theMockDatabase.clear();
  });

  it('Create item with tags', () => {
    boxViewPO.theThingPO.runAction(ImitationBox.actions['create-item']);
    itemPO.expectVisible();
    itemPO.theThingPO.setTags(testItem1.tags);
    itemPO.createItem(testItem1);
    boxViewPO.expectVisible();
    cy.wait(1000);
    boxViewPO.expectItemInEditing(testItem1);
    boxViewPO.gotoItem(testItem1);
    itemPO.expectVisible();
    itemPO.expectItem(testItem1);
    itemPO.theThingPO.expectTags(testItem1.tags);
  });

  it('Edit item tags', () => {
    const deleteTag: string = testItem1.tags.tags[0];
    const addTag = 'YYGGVERYGGYY';
    itemPO.theThingPO.openTagsEdit();
    const dialogPO = new YggDialogPageObjectCypress();
    const tagsControlPO = new TagsControlPageObjectCypress(
      dialogPO.getSelector()
    );
    tagsControlPO.deleteTag(deleteTag);
    tagsControlPO.addTag(addTag);
    dialogPO.confirm();
    itemPO.theThingPO.save(testItem1);
    siteNavigator.gotoMyBoxes();
    myBoxesPO.expectVisible();
    myBoxesPO.gotoBox(testBox);
    boxViewPO.expectVisible();
    boxViewPO.gotoItem(testItem1);
    itemPO.expectVisible();
    const tagViewPO = new TagsViewPageObjectCypress(itemPO.getSelector());
    tagViewPO.expectTag(addTag);
    tagViewPO.expectNoTag(deleteTag);
  });

  it('Can not edit tags after made available', () => {
    itemPO.publishAvailable(testItem1);
    itemPO.theThingPO.expectNoTagsEditButton();
  });

  it("Add tag to item increment the tag's popularity", () => {
    siteNavigator.gotoItemWarehouse();
    itemWarehousePO.expectVisible();
    tagControlPO.expectTopTags(top10Tags.map(tag => tag.name));
    tagControlPO.expectTopTag(tag10.name);
    tagControlPO.expectNoTopTag(tag11.name);

    testItem2.setTags(new Tags(at(forgedTags, [10, 14, 16]).map(t => t.name)));
    // console.debug(testItem2);
    testItem3.setTags(
      new Tags(at(forgedTags, [10, 12, 13, 17, 15]).map(t => t.name))
    );
    // console.debug(testItem3);
    // testItem2 and testITem3 both include tag11,
    // after creation of them,
    // the popularity of tag11 will increase by 2,
    // thus greater than popularity of tag10,
    // => Expect tag11 rotates tag10 out of top 10

    // Create testItem2
    siteNavigator.gotoMyBoxes();
    myBoxesPO.expectVisible();
    myBoxesPO.gotoBox(testBox);
    boxViewPO.expectVisible();
    boxViewPO.theThingPO.runAction(ImitationBox.actions['create-item']);
    itemPO.expectVisible();
    itemPO.theThingPO.setTags(testItem2.tags);
    itemPO.createItem(testItem2);
    cy.wait(1000);

    // Create testItem3
    siteNavigator.gotoMyBoxes();
    myBoxesPO.expectVisible();
    myBoxesPO.gotoBox(testBox);
    boxViewPO.expectVisible();
    boxViewPO.theThingPO.runAction(ImitationBox.actions['create-item']);
    itemPO.expectVisible();
    itemPO.theThingPO.setTags(testItem3.tags);
    itemPO.createItem(testItem3);
    cy.wait(3000);

    siteNavigator.gotoItemWarehouse();
    itemWarehousePO.expectVisible();
    tagControlPO.expectTopTag(tag11.name);
    tagControlPO.expectNoTopTag(tag10.name);
  });

  it('Edit item tags should sync their popularity', () => {
    const dialogPO = new YggDialogPageObjectCypress();
    const tagsControlPO = new TagsControlPageObjectCypress(
      dialogPO.getSelector()
    );

    // Edit testItem2 to add tag10, remove tag11
    siteNavigator.gotoMyBoxes();
    myBoxesPO.expectVisible();
    myBoxesPO.gotoBox(testBox);
    boxViewPO.expectVisible();
    boxViewPO.gotoItem(testItem2);
    itemPO.expectVisible();
    itemPO.theThingPO.openTagsEdit();
    tagsControlPO.deleteTag(tag11.name);
    tagsControlPO.addTag(tag10.name);
    dialogPO.confirm();
    itemPO.theThingPO.save(testItem2);
    cy.wait(1000);

    // Edit testItem3 to add tag10, remove tag11
    siteNavigator.gotoMyBoxes();
    myBoxesPO.expectVisible();
    myBoxesPO.gotoBox(testBox);
    boxViewPO.expectVisible();
    boxViewPO.gotoItem(testItem3);
    itemPO.expectVisible();
    itemPO.theThingPO.openTagsEdit();
    tagsControlPO.deleteTag(tag11.name);
    tagsControlPO.addTag(tag10.name);
    dialogPO.confirm();
    itemPO.theThingPO.save(testItem3);
    cy.wait(1000);

    siteNavigator.gotoItemWarehouse();
    itemWarehousePO.expectVisible();
    tagControlPO.expectTopTag(tag10.name);
    tagControlPO.expectNoTopTag(tag11.name);
  });
});
