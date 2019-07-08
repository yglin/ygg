import { Image } from '@ygg/shared/types';
import { MenuTree } from '@ygg/shared/ui/navigation';
import { AdminAgentComponent } from './admin-agent/admin-agent.component';
import { AdminScheduleFormsComponent } from './admin-schedule-forms/admin-schedule-forms.component';

export const adminMenu: MenuTree = new MenuTree({
  id: 'scheduler',
  icon: new Image('/assets/images/admin/accounting.png'),
  label: '遊程相關',
  tooltip: '遊程各項相關設定',
  link: 'scheduler'
});

adminMenu.addItem({
  id: 'staff',
  label: '角色人員',
  icon: new Image('/assets/images/admin/staff.svg'),
  link: 'staff',
  tooltip: '管理各帳號擔任的角色及工作人員'
}, 'scheduler');

adminMenu.addItem({
  id: 'agent',
  label: '接單服務人員',
  icon: new Image('/assets/images/admin/agent.svg'),
  link: 'agent',
  tooltip: '對外接單服務的聯絡窗口',
  component: AdminAgentComponent
}, 'staff');

adminMenu.addItem({
  id: 'forms',
  label: '遊程表單',
  icon: new Image('/assets/images/admin/schedule-forms.svg'),
  link: 'forms',
  tooltip: '管理遊程需求表單',
  component: AdminScheduleFormsComponent
}, 'scheduler');
