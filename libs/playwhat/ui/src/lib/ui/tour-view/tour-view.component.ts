import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { TheThingImitationViewInterface } from '@ygg/the-thing/ui';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import { Subscription, Observable } from 'rxjs';
import { Album } from '@ygg/shared/omni-types/core';
import { RelationNamePlay } from '@ygg/playwhat/core';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'ygg-tour-view',
  templateUrl: './tour-view.component.html',
  styleUrls: ['./tour-view.component.css']
})
export class TourViewComponent
  implements OnInit, OnDestroy, TheThingImitationViewInterface {
  @Input() theThing$: Observable<TheThing>;
  tour: TheThing;
  noteHtml: string;
  contactsHtml: string;
  plays: TheThing[];
  subscriptions: Subscription[] = [];
  titleStyle: any = {};

  constructor(private theThingAccessService: TheThingAccessService) {}

  ngOnInit() {
    if (this.theThing$) {
      this.subscriptions.push(
        this.theThing$
          .pipe(
            tap(theThing => {
              if (theThing) {
                this.tour = theThing;
                this.noteHtml = this.tour.cells['注意事項'].value;
                this.contactsHtml = this.tour.cells['聯絡資訊'].value;
                // console.log(this.tour.relations);
                this.subscriptions.push(
                  this.theThingAccessService
                    .listByIds$(
                      this.tour.getRelationObjectIds(RelationNamePlay)
                    )
                    .subscribe(plays => {
                      this.plays = plays;
                    })
                );
                if ('照片' in this.tour.cells) {
                  const album: Album = this.tour.cells['照片'].value;
                  if (album.cover) {
                    this.titleStyle = {
                      width: '90vw',
                      height: '75vh',
                      'background-image': `url("${album.cover.src}")`,
                      'background-size': '100% 100%',
                      '-webkit-mask':
                        'radial-gradient(ellipse at 40% 60%, #fff 30%, transparent 60%)',
                      mask:
                        'radial-gradient(circle at center, #222, transparent)'
                    };
                  }
                }
              }
            })
          )
          .subscribe()
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
