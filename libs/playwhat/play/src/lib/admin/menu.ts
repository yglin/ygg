import { Image } from '@ygg/shared/omni-types/core';
import { MenuTree } from '@ygg/shared/ui/navigation';

export const adminMenu: MenuTree = new MenuTree({
  id: 'play',
  icon: new Image('/assets/images/admin/play.svg'),
  label: '體驗相關',
  tooltip: '體驗各項相關設定',
  link: 'play'
});
