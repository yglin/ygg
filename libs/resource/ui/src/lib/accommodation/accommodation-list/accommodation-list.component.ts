import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Accommodation } from '@ygg/resource/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccommodationService } from '@ygg/resource/data-access';

@Component({
  selector: 'ygg-accommodation-list',
  templateUrl: './accommodation-list.component.html',
  styleUrls: ['./accommodation-list.component.css']
})
export class AccommodationListComponent implements OnInit, OnDestroy {
  @Input() accommodations: Accommodation[];
  @Input() readonly;
  subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.readonly =
      this.readonly !== undefined &&
      this.readonly !== false &&
      this.readonly !== 'false';
    if (!this.accommodations && this.route.data) {
      this.subscriptions.push(
        this.route.data.subscribe(data => {
          if (data && data.accommodations) {
            this.accommodations = data.accommodations;
          }
        })
      );
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onClickItem(item: Accommodation) {
    this.router.navigate(['/accommodations', item.id]);
  }

  onClickAdd() {
    this.router.navigate(['/accommodations', 'new']);
  }
}
