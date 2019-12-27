export class TheThingCellListPageObjectCypress {
  gotoCreatePage() {
    cy.get('button.to-create').click();
  }
}