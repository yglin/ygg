import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { CustomPagePageObjectCypress } from '@ygg/shared/custom-page/test';

export class SiteHowtoPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.site-howto'
  };

  customPagePO: CustomPagePageObjectCypress;

  constructor(parentSelector?: string) {
    super(parentSelector);
    this.customPagePO = new CustomPagePageObjectCypress(this.getSelector());
  }
}
