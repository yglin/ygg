import { HomePageObject } from '../support/home.po';

describe('ourbox home page', () => {
  const homePO = new HomePageObject();

  beforeEach(() => cy.visit('/'));

  it('should display link of creating new box first time', () => {
    homePO.gotoBoxCreate();
  });

  it('should display link of map', () => {
    homePO.gotoMap();
  });
});
