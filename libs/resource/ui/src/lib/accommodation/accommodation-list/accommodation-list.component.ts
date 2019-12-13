import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Accommodation } from '@ygg/resource/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ygg-accommodation-list',
  templateUrl: './accommodation-list.component.html',
  styleUrls: ['./accommodation-list.component.css']
})
export class AccommodationListComponent implements OnInit, OnDestroy {
  @Input() accommodations: Accommodation[];
  @Input() readonly;
  subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.readonly = this.readonly !== undefined && this.readonly !== false && this.readonly !== 'false';
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
}
