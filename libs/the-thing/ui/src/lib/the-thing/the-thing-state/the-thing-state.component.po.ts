import { PageObject } from '@ygg/shared/test/page-object';
import { TheThing, TheThingState } from '@ygg/the-thing/core';

export abstract class TheThingStatePageObject extends PageObject {
  selectors = {
    main: '.the-thing-state',
    label: '.label'
  };

  getSelectorForButtonState(state: TheThingState): string {
    return `${this.getSelector()} .actions [state-name="${state.name}"] button`;
  }

  abstract setValue(theThing: TheThing, state: TheThingState);
  abstract expectValue(state: TheThingState);
  abstract expectNoStateButton(state: TheThingState): void;
  abstract expectStateButton(state: TheThingState): void;
}
