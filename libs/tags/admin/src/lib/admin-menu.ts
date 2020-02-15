import { Image } from '@ygg/shared/omni-types/core';
import { MenuTree } from '@ygg/shared/ui/navigation';
import { TagsAdminListComponent } from './tags-admin-list/tags-admin-list.component';
import { TagsAdminUserOptionsComponent } from './tags-admin-user-options/tags-admin-user-options.component';

export const adminMenu: MenuTree = new MenuTree({
  id: 'tags',
  icon: new Image('/assets/images/admin/tags/tags.svg'),
  label: '標籤相關',
  tooltip: '標籤相關設定',
  link: 'tags'
});

adminMenu.addItem({
  id: 'list',
  label: '所有標籤總覽',
  icon: new Image('/assets/images/admin/tags/list.svg'),
  link: 'list',
  tooltip: '顯示所有標籤，可新增或刪除',
  component: TagsAdminListComponent
}, 'tags');

adminMenu.addItem({
  id: 'user-options',
  label: '使用者選單顯示',
  icon: new Image('/assets/images/admin/tags/user-options.svg'),
  link: 'user-options',
  tooltip: '顯示在使用者輸入時，自動完成的選單中',
  component: TagsAdminUserOptionsComponent
}, 'tags');
