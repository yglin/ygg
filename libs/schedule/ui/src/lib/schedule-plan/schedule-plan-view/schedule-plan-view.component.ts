import { Component, OnInit, Input } from '@angular/core';
import { SchedulePlan } from '@ygg/schedule/core';
import { TranspotationTypes } from '@ygg/schedule/core';
import { AuthenticateService, User } from "@ygg/shared/user/ui";
import { Accommodation } from '@ygg/resource/core';
import { AccommodationService } from '@ygg/resource/data-access';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ygg-schedule-plan-view',
  templateUrl: './schedule-plan-view.component.html',
  styleUrls: ['./schedule-plan-view.component.css']
})
export class SchedulePlanViewComponent implements OnInit {
  @Input() schedulePlan: SchedulePlan;
  transpotationTypes = TranspotationTypes;
  accommodations: Accommodation[];
  subscriptions: Subscription[] = [];

  constructor(private accommodationService: AccommodationService) {
    this.subscriptions.push(
      this.accommodationService
        .list$()
        .subscribe(accommodations => (this.accommodations = accommodations))
    );
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
