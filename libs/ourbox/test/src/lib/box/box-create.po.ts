import { PageObjectCypress } from '@ygg/shared/test/cypress';

export class BoxCreatePageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.box-create'
  };
}
