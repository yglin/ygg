import { last } from "lodash";
import { TheThingViewPageObjectCypress } from "./the-thing-view.po";

export function getCreatedTheThingId(
  newIdAlias: string = 'newTheThingId'
): Cypress.Chainable<any> {
  const theThingViewPO = new TheThingViewPageObjectCypress();
  theThingViewPO.expectVisible();
  cy.location('pathname').then((pathname: any) => {
    const id = last((pathname as string).split('/'));
    cy.wrap(id).as(newIdAlias);
  });
  return cy.get(`@${newIdAlias}`, { timeout: 10000 });
}