import { PageObject } from '@ygg/shared/test/page-object';

export abstract class ControlViewSwitchPageObject extends PageObject {
  selectors = {
    main: '.control-view-switch',
    buttonOpenControl: 'button.open-control',
    buttonCloseControl: 'button.close-control'
  };

  abstract openControl(): void;
  abstract closeControl(): void;
}
