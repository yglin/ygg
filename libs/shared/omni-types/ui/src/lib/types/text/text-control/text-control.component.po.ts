import { PageObject } from '@ygg/shared/test/page-object';
import { OmniTypeControlPageObject } from '../../../omni-type';

export abstract class TextControlPageObject extends OmniTypeControlPageObject {
  selectors = {
    main: '.text-control',
    inputText: 'input'
  };
}
