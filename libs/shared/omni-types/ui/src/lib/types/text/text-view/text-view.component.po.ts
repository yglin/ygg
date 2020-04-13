import { OmniTypeViewPageObject } from '../../../omni-type';

export abstract class TextViewPageObject extends OmniTypeViewPageObject {
  selectors = {
    main: '.text-view',
    value: '.value'
  };
}
