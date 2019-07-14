import { Image } from '@ygg/shared/types';
import { MenuTree } from '@ygg/shared/ui/navigation';
import { AdminPlayTagsComponent } from './admin-play-tags/admin-play-tags.component';

export const adminMenu: MenuTree = new MenuTree({
  id: 'play',
  icon: new Image('/assets/images/admin/play.svg'),
  label: '體驗相關',
  tooltip: '體驗各項相關設定',
  link: 'play'
});

adminMenu.addItem({
  id: 'tags',
  label: '類型標籤設定',
  icon: new Image('/assets/images/admin/play-tags.svg'),
  link: 'tags',
  tooltip: '管理體驗類型的標籤設定',
  component: AdminPlayTagsComponent
}, 'play');
