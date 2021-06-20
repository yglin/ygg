import { PageObjectCypress } from '@ygg/shared/test/cypress';

export class GreetingPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.ourbox-greeting'
  };

  expectFirstTimeGreeting() {
    cy.get(this.getSelector()).contains(`嗨～第一次造訪我們的藏寶圖嗎？`);
    cy.get(this.getSelector()).contains(
      `這是一個跟社區鄰居分享二手物品的網站。`
    );
    cy.get(this.getSelector()).contains(
      `家中長期用不到的二手物品，也許在別人的眼中可是寶物喔～`
    );
    cy.get(this.getSelector()).contains(`何不試著從分享寶物開始呢？`);
  }
}
