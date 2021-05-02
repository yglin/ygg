import { MapNavigatorPageObjectCypress } from '@ygg/shared/geography/test';
import { TagsControlPageObjectCypress } from '@ygg/shared/tags/test';
import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { ImageThumbnailListPageObjectCypress } from '@ygg/shared/ui/test';

export class TreasureMapPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.treasure-map',
    'tags-input': '.tags-search .tags input',
    'treasure-list': '.treasure-list',
    map: '.map-navigator'
  };

  mapNavigatorPO: MapNavigatorPageObjectCypress;
  tagsControlPO: TagsControlPageObjectCypress;
  treasureListPO: ImageThumbnailListPageObjectCypress;

  constructor(parentSelector: string = '') {
    super(parentSelector);
    this.tagsControlPO = new TagsControlPageObjectCypress(this.getSelector());
    this.treasureListPO = new ImageThumbnailListPageObjectCypress(
      this.getSelector('treasure-list')
    );
    this.mapNavigatorPO = new MapNavigatorPageObjectCypress(
      this.getSelector('map')
    );
  }
}
