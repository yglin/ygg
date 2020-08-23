import { PageObjectCypress } from '@ygg/shared/test/cypress';

export class UserThumbnailPageObjectCypress extends PageObjectCypress {
  selectors = {
    main:'.ygg-user-thumbnail'
  };
}