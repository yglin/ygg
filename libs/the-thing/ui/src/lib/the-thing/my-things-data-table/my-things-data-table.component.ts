import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticateService } from '@ygg/shared/user/ui';
import { TheThing, TheThingImitation } from '@ygg/the-thing/core';
import { Observable, Subscription } from 'rxjs';
import { TheThingAccessService } from '../../the-thing-access.service';

@Component({
  selector: 'my-things-data-table',
  templateUrl: './my-things-data-table.component.html',
  styleUrls: ['./my-things-data-table.component.css']
})
export class MyThingsDataTableComponent implements OnInit {
  @Input() imitation: TheThingImitation;
  theThings$: Observable<TheThing[]>;
  selection: TheThing[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private theThingAccessService: TheThingAccessService,
    private authService: AuthenticateService
  ) {}

  ngOnInit() {
    if (!this.imitation) {
      if (this.route.snapshot.data.imitation) {
        this.imitation = this.route.snapshot.data.imitation;
      }
    }
    if (this.imitation && this.authService.currentUser) {
      const filterMy = this.imitation.filter.clone();
      // const filterMy = new TheThingFilter();
      filterMy.ownerId = this.authService.currentUser.id;
      // console.dir(filterMy);
      this.theThings$ = this.theThingAccessService.listByFilter$(filterMy);
    } else {
      console.error(
        `Error Input imitation:${this.imitation} for component MyThingsDataTableComponent`
      );
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  async deleteSelected() {
    const namesMessage = this.selection.map(s => s.name).join('\n');
    if (confirm(`確定要永久刪除以下物件？\n${namesMessage}`)) {
      try {
        await this.theThingAccessService.delete(this.selection);
        alert(`已刪除以下物件\n${namesMessage}`);
      } catch (error) {
        alert(`刪除失敗，錯誤原因： ${error.message}`);
      }
    }
  }

  gotoCreate() {
    const routePath = this.imitation.id || 'the-things';
    this.router.navigate(['/', 'the-things', routePath, 'create']);
  }
}
