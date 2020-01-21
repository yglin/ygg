import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { TheThingImitationViewInterface } from '@ygg/the-thing/ui';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import { Subscription } from 'rxjs';
import { Album } from "@ygg/shared/types";

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
  titleStyle: any = {};

  constructor(private theThingAccessService: TheThingAccessService) {}

  ngOnInit() {
    if (this.theThing) {
      this.tour = this.theThing;
      this.noteHtml = this.tour.cells['注意事項'].value;
      this.contactsHtml = this.tour.cells['聯絡資訊'].value;
      console.log(this.tour.relations);
      this.subscriptions.push(
        this.theThingAccessService
          .listByIds$(this.tour.relations['體驗'])
          .subscribe(plays => {
            this.plays = plays;
          })
      );
      if('照片' in this.tour.cells) {
        const album: Album = this.tour.cells['照片'].value;
        if (album.cover) {
          this.titleStyle = {
            width: "90vw",
            height: "75vh",
            "background-image": `url("${album.cover.src}")`,
            "background-size": '100% 100%',
            "-webkit-mask": "radial-gradient(ellipse at 30% 70%, #fff 50%, transparent 80%)",
            "mask": "radial-gradient(circle at center, #222, transparent)"
          }
        }
      }
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
