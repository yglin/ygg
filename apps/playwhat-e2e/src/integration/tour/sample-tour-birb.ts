import * as SampleTourJSON from './sample-tour-birb.json';
import { TheThing } from "@ygg/the-thing/core";
import { MockDatabase } from "@ygg/shared/test/cypress";
import { User } from "@ygg/shared/user/core";

export const sampleTour = new TheThing().fromJSON(SampleTourJSON.tour);
export const samplePlays = SampleTourJSON.plays.map(playJSON =>
  new TheThing().fromJSON(playJSON)
);
export const relationName = '體驗';
sampleTour.addRelations(relationName, samplePlays);

export function insertDatabase(mockDatabase: MockDatabase, owner?: User) {
  const stubTheThings = [sampleTour, ...samplePlays];
  if (owner) {
    stubTheThings.forEach(thing => thing.ownerId = owner.id);
  }
  cy.wrap(stubTheThings).each((thing: any) => {
    mockDatabase.insert(
      `${TheThing.collection}/${thing.id}`,
      thing.toJSON()
    );
  });  
}