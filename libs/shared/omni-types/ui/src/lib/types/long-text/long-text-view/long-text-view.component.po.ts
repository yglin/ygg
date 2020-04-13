import { OmniTypeViewPageObject } from '../../../omni-type';

export abstract class LongTextViewPageObject extends OmniTypeViewPageObject {
  selectors = {
    main: '.long-text-view',
    value: '.value'
  };
}
