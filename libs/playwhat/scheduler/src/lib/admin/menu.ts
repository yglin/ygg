import { Image } from '@ygg/shared/types';
import { MenuTree } from '@ygg/shared/ui/navigation';

export const adminMenu: MenuTree = new MenuTree({
  id: 'scheduler',
  icon: new Image('/assets/images/admin/accounting.png'),
  label: '遊程相關',
  tooltip: '遊程規劃相關設定',
  link: 'scheduler'
});

