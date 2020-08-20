import { MapSearchPageObjectCypress, BoxCreatePageObjectCypress } from '@ygg/ourbox/test';
import { waitForLogin } from '@ygg/shared/user/test';

describe('Ourbox home page, as guest(not login)', () => {
  const mapSearchPO = new MapSearchPageObjectCypress();
  const boxCreatePO = new BoxCreatePageObjectCypress();
  // const myBoxesPO = new MyBoxesPageObjectCypress();

  before(() => {
    cy.visit('/');
    waitForLogin();
  });

  it('Should show link of map-search', () => {
    cy.get('a.map-search').click({ force: true });
    mapSearchPO.expectVisible({ timeout: 10000 });
    cy.go('back');
  });

  it('Should show link of create-box if user has no box', () => {
    cy.get('a.create-box').click({ force: true });
    boxCreatePO.expectVisible({ timeout: 10000 });
    cy.go('back');
  });

  // it('Should show link of my-boxes if user has any box', () => {
  //   cy.get('a.my-boxes').click({ force: true });
  //   myBoxesPO.expectVisible({timeout: 10000});
  //   cy.go('back');
  // });
});
