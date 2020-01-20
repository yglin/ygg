import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { TheThingImitationViewInterface } from '@ygg/the-thing/ui';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ygg-tour-view',
  templateUrl: './tour-view.component.html',
  styleUrls: ['./tour-view.component.css']
})
export class TourViewComponent
  implements OnInit, OnDestroy, TheThingImitationViewInterface {
  @Input() theThing: TheThing;
  tour: TheThing;
  noteHtml: string;
  contactsHtml: string;
  plays: TheThing[];
  subscriptions: Subscription[] = [];

  constructor(private theThingAccessService: TheThingAccessService) {}

  ngOnInit() {
    if (this.theThing) {
      this.tour = this.theThing;
      this.noteHtml = this.tour.cells['注意事項'].value;
      this.contactsHtml = this.tour.cells['聯絡資訊'].value;
      this.subscriptions.push(
        this.theThingAccessService
          .listByIds$(this.tour.relations['體驗'])
          .subscribe(plays => {
            this.plays = plays;
          })
      );
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
