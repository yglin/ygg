import { Image } from "@ygg/shared/types";
import { adminMenu } from "./menu";
import { AdminAgentComponent } from './admin-agent/admin-agent.component';

adminMenu.addItem({
  id: 'staff',
  label: '角色人員',
  icon: new Image('/assets/images/admin/users.png'),
  link: 'staff',
  tooltip: '管理各帳號擔任的角色及工作人員'
}, 'scheduler');

adminMenu.addItem({
  id: 'agent',
  label: '接單服務人員',
  icon: new Image('/assets/images/admin/staff.svg'),
  link: 'agent',
  tooltip: '對外接單服務的聯絡窗口',
  component: AdminAgentComponent
}, 'staff');
