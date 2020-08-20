import { castArray, isEmpty } from 'lodash';

export class SiteNavigator {
  goto(paths: string[] | string) {
    paths = castArray(paths);
    if (isEmpty(paths)) {
      throw Error(`SiteNavigator.goto(): No path specified, ${paths}`);
    }
    switch (paths[0]) {
      case 'home':
        this.gotoHome();
        break;

      default:
        break;
    }
  }

  gotoHome() {
    cy.get('.header .home').click();
  }
}
