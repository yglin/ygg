import { siteNavigator } from "../support/site-navigator";
import { TheThingCell } from "@ygg/the-thing/core";
import { TheThingCellListPageObjectCypress } from "../page-objects/cell";

describe('Create a new the-thing', () => {

  it('Create cell, with the derived form create a new the-thing', () => {
    // Forge test data
    const cellWhole = TheThingCell.forge({
      DNAs: 'all'
    });
    const theThing = cellWhole.forgeTheThing();

    // Navigate to Cell creation page
    siteNavigator.goto(['cells']);
    const theThingCellListPO = new TheThingCellListPageObjectCypress();
    theThingCellListPO.gotoCreatePage();

    // // Create a Cell with all DNAs, as Cell-whole
    // theThingCellEditPO = new TheThingCellEditPageObjectCypress();
    // for (const DNA of DNAs) {
    //   theThingCellEditPO.addDNA(DNA);
    // }
    // theThingCellEditPO.submit();

    // // Navigate to form of Cell-whole
    // siteNavigator.goto(['cells']);
    // theThingCellListPO.clickOnCell(cellWhole);
    // const theThingCellViewPO = new TheThingCellViewPageObjectCypress();
    // theThingCellViewPO.gotoCreatePage();

    // // Create a new the-thing with the form
    // const theThingEditPO = new TheThingEditPageObjectCypress();
    // theThingEditPO.setValue(theThing);
    // theThingEditPO.submit();

    // // Navigate to the view of new the-thing
    // // Automatically redirect to view when submitted in edit page
    // const theThingViewPO = new theThingViewPageObjectCypress();

    // // Confirm data consistensy
    // theThingViewPO.expectValue(theThing);
  });
});
