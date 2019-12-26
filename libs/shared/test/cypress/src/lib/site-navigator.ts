export interface RouteNode {
  path: string;
  children: RouteNode[];
  routeMethod: Function;
}

export class SiteNavigator {
  siteMap: RouteNode;

  constructor(siteMap: RouteNode) {
    this.siteMap = siteMap;
  }

  goto(path: string[] = ['']): Cypress.Chainable<any> {
    const fullPathName = `/${path.join('/')}`;
    this.route(this.siteMap, path);
    return cy.location('pathname', {timeout: 10000}).should('eq', fullPathName);
  }

  route(routeNode: RouteNode, path: string[] = []) {
    routeNode.routeMethod();
    const nextPath = path.shift();
    for (const childRoute of routeNode.children) {
      if (childRoute.path === nextPath) {
        this.route(childRoute, path);
        break;
      }
    }
  }
}