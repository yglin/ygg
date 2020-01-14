import { last } from "lodash";
import { TheThingViewPageObjectCypress } from "../page-objects/the-thing";

// Wait for navigating to view page
export function waitForTheThingCreated(
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

