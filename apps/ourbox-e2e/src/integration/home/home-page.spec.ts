import {
  TreasureMapPageObjectCypress,
  GreetingPageObjectCypress
} from '@ygg/ourbox/test';
import { YggDialogPageObjectCypress } from '@ygg/shared/ui/test';
import { myBeforeAll } from '../before-all';

describe('Ourbox home page', () => {
  // function getPageLink(page: Page): string {
  //   return `.link-card a:contains("${page.label}")`;
  // }

  // const headerPO = new HeaderPageObjectCypress();
  // const siteNavigator = new SiteNavigator();
  // const sideDrawerPO = new SideDrawerPageObjectCypress();
  // const mapSearchPO = new MapSearchPageObjectCypress();
  // const boxCreatePO = new BoxCreatePageObjectCypress();
  // const siteHowtoPO = new SiteHowtoPageObjectCypress();
  // const myBoxesPO = new MyBoxesPageObjectCypress();
  // const itemWarehousePO = new ItemWarehousePageObjectCypress();

  // const sampleBox = ImitationBox.forgeTheThing();
  // const SampleDocuments: Document[] = [];
  // const userWithoutBox: User = testUsers[0];
  // const userWithBox: User = testUsers[1];

  // sampleBox.addUsersOfRole(RelationshipBoxMember.role, [userWithBox.id]);
  // SampleDocuments.push({
  //   path: `${User.collection}/${userWithoutBox.id}`,
  //   data: userWithoutBox
  // });
  // SampleDocuments.push({
  //   path: `${User.collection}/${userWithBox.id}`,
  //   data: userWithBox
  // });
  // SampleDocuments.push({
  //   path: `${sampleBox.collection}/${sampleBox.id}`,
  //   data: sampleBox
  // });

  const treasureMapPO = new TreasureMapPageObjectCypress();

  before(() => {
    // sampleBox.ownerId = user.id;
    // cy.wrap(SampleDocuments).each((doc: Document) => {
    //   theMockDatabase.insert(doc.path, doc.data);
    // });
    myBeforeAll();
    cy.visit('/');
  });

  // beforeEach(function() {
  //   siteNavigator.gotoHome();
  // });

  after(() => {
    // theMockDatabase.clear();
  });

  it('Should redirect to treasure map page at home route', () => {
    treasureMapPO.expectVisible({ timeout: 10000 });
  });

  it('Should show greeting message if user first time visit', () => {
    window.localStorage.removeItem('visited');
    cy.visit('/');
    const dialogPO = new YggDialogPageObjectCypress();
    const greetingPO = new GreetingPageObjectCypress(dialogPO.getSelector());
    dialogPO.expectTitle('歡迎光臨我們的寶箱');
    greetingPO.expectFirstTimeGreeting();
  });

  // it('Should show link of site-howto if first visit', () => {
  //   // Hide link of map-search
  //   cy.get(getPageLink(OurboxPages.mapSearch)).should('not.be.visible');

  //   cy.get(getPageLink(OurboxPages.siteHowto)).click({ force: true });
  //   siteHowtoPO.expectVisible({ timeout: 10000 });
  // });

  // it('Should show link of site-howto in side-drawer', () => {
  //   headerPO.openSideDrawer();
  //   sideDrawerPO.expectVisible();
  //   sideDrawerPO.clickLink(OurboxPages.siteHowto);
  //   siteHowtoPO.expectVisible({ timeout: 10000 });
  // });

  // it('Should show link of map-search if not first visit', () => {
  //   cy.visit('/');
  //   // Hide link of site-howto
  //   cy.get(getPageLink(OurboxPages.siteHowto)).should('not.be.visible');

  //   cy.get(getPageLink(OurboxPages.mapSearch)).click({ force: true });
  //   mapSearchPO.expectVisible({ timeout: 10000 });
  // });

  // it('Should show link of map-search in side-drawer', () => {
  //   headerPO.openSideDrawer();
  //   sideDrawerPO.expectVisible();
  //   sideDrawerPO.clickLink(OurboxPages.mapSearch);
  //   mapSearchPO.expectVisible({ timeout: 10000 });
  // });

  // it('Should show link of box-create if user has no box', () => {
  //   loginTestUser(userWithoutBox);
  //   // Hide link of my-boxes
  //   cy.get(getPageLink(OurboxPages.myBoxes)).should('not.be.visible');
  //   cy.get(getPageLink(OurboxPages.boxCreate)).click({ force: true });
  //   boxCreatePO.expectVisible({ timeout: 10000 });
  //   logout();
  // });

  // it('Should show link of box-create in side-drawer', () => {
  //   headerPO.openSideDrawer();
  //   sideDrawerPO.expectVisible();
  //   sideDrawerPO.clickLink(OurboxPages.boxCreate);
  //   boxCreatePO.expectVisible({ timeout: 10000 });
  // });

  // it('Should show link of my-boxes if user is member of any box', () => {
  //   loginTestUser(userWithBox);
  //   // Hide link of box-create
  //   cy.get(getPageLink(OurboxPages.boxCreate), { timeout: 10000 }).should(
  //     'not.be.visible'
  //   );
  //   cy.get(getPageLink(OurboxPages.myBoxes), { timeout: 10000 }).click({
  //     force: true
  //   });
  //   myBoxesPO.expectVisible({ timeout: 10000 });
  //   logout();
  // });

  // it('Should show links of box-create as guest', () => {
  //   // Hide link of my-boxes
  //   cy.get(getPageLink(OurboxPages.myBoxes)).should('not.be.visible');

  //   cy.get(getPageLink(OurboxPages.boxCreate)).click({ force: true });
  //   boxCreatePO.expectVisible({ timeout: 10000 });
  // });

  // it('Should show link of item-warehouse in side-drawer', () => {
  //   headerPO.openSideDrawer();
  //   sideDrawerPO.expectVisible();
  //   sideDrawerPO.clickLink(OurboxPages.itemWarehouse);
  //   itemWarehousePO.expectVisible({ timeout: 10000 });
  // });
});
