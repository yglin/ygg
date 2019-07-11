import { Routes } from '@angular/router';
import { LoggedInGuard, AdminGuard } from '@ygg/shared/user';
// import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
// import { adminMenu as schedulerAdminMenu } from "@ygg/playwhat/scheduler";
import { MenuTree } from '@ygg/shared/ui/navigation';
import { Image } from "@ygg/shared/types";

const adminMenu = new MenuTree({
  id: 'admin-dashborad',
  link: 'admin',
  label: '後台管控室',
  icon: new Image(),
  tooltip: '管理一些ㄨＡ伯Ａ設定',
  routeConfig: {
    canActivateChild: [LoggedInGuard, AdminGuard]
  }
});

// adminMenu.addItem(schedulerAdminMenu.root);

export const routes: Routes = [
  adminMenu.toRoute()
  // {
  //   path: 'admin',
  //   canActivateChild: [LoggedInGuard, AdminGuard],
  //   children: [
  //     { path: '', pathMatch: 'full', component: AdminDashboardComponent },
  //     schedulerAdminMenu.toRoute()
  //   ]
  // }
];
