import { PageObjectCypress } from '@ygg/shared/test/cypress';

export class SiteHowtoPageObjectCypress extends PageObjectCypress {
  selectors = {
    main:'.site-howto'
  };
}