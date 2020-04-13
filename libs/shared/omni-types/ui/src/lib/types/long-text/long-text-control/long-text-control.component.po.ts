import { OmniTypeControlPageObject } from '../../../omni-type';

export abstract class LongTextControlPageObject extends OmniTypeControlPageObject {
  selectors = {
    main: '.long-text-control',
    inputLongText: 'textarea'
  };
}
