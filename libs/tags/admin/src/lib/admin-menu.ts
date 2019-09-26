import { Image } from '@ygg/shared/types';
import { MenuTree } from '@ygg/shared/ui/navigation';
import { TagsAdminUserOptionsComponent } from './tags-admin-user-options/tags-admin-user-options.component';

export const adminMenu: MenuTree = new MenuTree({
  id: 'tag',
  icon: new Image('/assets/images/admin/tag/tag.svg'),
  label: '標籤相關',
  tooltip: '標籤相關設定',
  link: 'tag'
});

adminMenu.addItem({
  id: 'user-options',
  label: '使用者選單顯示',
  icon: new Image('/assets/images/admin/tag/user-options.svg'),
  link: 'user-options',
  tooltip: '顯示在使用者輸入時，自動完成的選單中',
  component: TagsAdminUserOptionsComponent
}, 'user-options');
