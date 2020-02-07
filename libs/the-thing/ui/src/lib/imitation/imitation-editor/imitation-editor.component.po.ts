import { PageObject } from '@ygg/shared/test/page-object';

export class ImitationEditorPageObject extends PageObject {
  selectors = {
    main: '.imitation-editor',
    tab1Header: '.template-selector.tab-header',
    tab2Header: '.imitation-form.tab-header',
    templateSelector: '.template-selector',
    inputName: '.name input',
    textareaDescription: '.description textarea',
    buttonSubmit: 'button.submit'
  };
}
