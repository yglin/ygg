import { PageObject } from '@ygg/shared/test/page-object';

export class ImitationManagerPageObject extends PageObject {
  selectors = {
    main: '.imitation-manager',
    buttonAddImitation: 'button.add'
  };
}
