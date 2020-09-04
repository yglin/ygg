import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { Comment } from '@ygg/shared/thread/core';
import { HtmlControlPageObjectCypress } from '@ygg/shared/omni-types/test';
import { Html } from '@ygg/shared/omni-types/core';

export class TheThingStateChangeRecordPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.the-thing-state-change-record',
    hint: '.hint',
    inputMessage: '.input-message'
  };

  expectHint(hint: string) {
    cy.get(this.getSelector('hint')).should('include.text', hint);
  }

  addMessage(message: string) {
    const htmlControlPO = new HtmlControlPageObjectCypress(
      this.getSelector('inputMessage')
    );
    htmlControlPO.setValue(new Html(message));
  }
}
