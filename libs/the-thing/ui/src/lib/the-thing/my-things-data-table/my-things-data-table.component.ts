import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticateService } from '@ygg/shared/user/ui';
import { TheThing, TheThingImitation } from '@ygg/the-thing/core';
import { Observable, Subscription } from 'rxjs';
import { TheThingAccessService } from '../../the-thing-access.service';
import { TheThingFactoryService } from '../../the-thing-factory.service';
import { TheThingSourceService } from '../../the-thing-source.service';

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
    private theThingSource: TheThingSourceService,
    private theThingFactory: TheThingFactoryService,
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
      this.theThings$ = this.theThingSource.listByFilter$(
        filterMy,
        this.imitation.collection
      );
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
        await this.theThingSource.delete(this.selection);
        alert(`已刪除以下物件\n${namesMessage}`);
      } catch (error) {
        alert(`刪除失敗，錯誤原因： ${error.message}`);
      }
    }
  }

  gotoCreate() {
    // console.log(this.imitation);
    this.theThingFactory.launchCreation(this.imitation);
  }
}
