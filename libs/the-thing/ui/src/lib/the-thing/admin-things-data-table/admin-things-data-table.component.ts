import { Component, OnInit, Input } from '@angular/core';
import { TheThingImitation, TheThing } from '@ygg/the-thing/core';
import { Observable, Subscription } from 'rxjs';
import { TheThingAccessService } from '../../the-thing-access.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'admin-things-data-table',
  templateUrl: './admin-things-data-table.component.html',
  styleUrls: ['./admin-things-data-table.component.css']
})
export class AdminThingsDataTableComponent implements OnInit {
  @Input() imitation: TheThingImitation;
  theThings$: Observable<TheThing[]>;
  selection: TheThing[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private theThingAccessService: TheThingAccessService
  ) {}

  ngOnInit() {
    if (!this.imitation) {
      if (this.route.snapshot.data.imitation) {
        this.imitation = this.route.snapshot.data.imitation;
      }
    }
    if (this.imitation) {
      this.theThings$ = this.theThingAccessService.listByFilter$(
        this.imitation.filter
      );
    } else {
      console.error(
        `Error Input imitation:${this.imitation} for component AdminThingsDataTableComponent`
      );
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  async deleteSelected() {
    if (
      confirm(
        `確定要永久刪除以下物件？\n${this.selection
          .map(s => s.name)
          .join('\n')}`
      )
    ) {
      try {
        await this.theThingAccessService.delete(this.selection);
        alert(`已刪除以下物件\n${this.selection.map(s => s.name).join('\n')}`);
      } catch (error) {
        alert(`刪除失敗，錯誤原因： ${error.message}`);
      }
    }
  }
}
