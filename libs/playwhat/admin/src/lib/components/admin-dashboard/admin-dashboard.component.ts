import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminMenuService } from '../../admin-menu.service';
import { MenuItem } from '@ygg/shared/ui/navigation';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ygg-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  menuItems: MenuItem[];
  subscriptions: Subscription[];

  constructor(private adminMenuService: AdminMenuService) {
    this.subscriptions = [];
    this.subscriptions.push(
      this.adminMenuService.menuItems$.subscribe(
        menuItems => (this.menuItems = menuItems)
      )
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
