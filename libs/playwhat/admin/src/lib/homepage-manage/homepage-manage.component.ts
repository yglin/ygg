import { isEmpty, uniqBy, remove } from 'lodash';
import { Component, OnInit } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { YggDialogService } from '@ygg/shared/ui/widgets';
import { TheThingFinderComponent } from '@ygg/the-thing/ui';
import { Subscription, of } from 'rxjs';
import { HomepageManageService } from './homepage-manage.service';

const adminDataPath = 'homepage/exhibits';

@Component({
  selector: 'ygg-homepage-manage',
  templateUrl: './homepage-manage.component.html',
  styleUrls: ['./homepage-manage.component.css']
})
export class HomepageManageComponent implements OnInit {
  exhibitThings: TheThing[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private dialog: YggDialogService,
    private homepageManageService: HomepageManageService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.homepageManageService.loadExhibitThings$().subscribe(things => {
        this.exhibitThings = things;
      })
    );
  }

  addExhibitThing() {
    const dialogRef = this.dialog.open(TheThingFinderComponent, {
      title: '選取作為首頁展示用的物件'
    });
    dialogRef.afterClosed().subscribe(async (things: TheThing[]) => {
      if (!isEmpty(things)) {
        this.exhibitThings = uniqBy(this.exhibitThings.concat(things), 'id');
        try {
          await this.homepageManageService.saveExhibitThings(
            this.exhibitThings
          );
        } catch (error) {
          alert(`儲存失敗，錯誤原因：${error.message}`);
        }
      }
    });
  }

  async removeExhibitThing(targetThing: TheThing) {
    if (targetThing && confirm(`將 ${targetThing.name} 從首頁展示中移除？`)) {
      try {
        const result = this.exhibitThings.filter(
          thing => thing.id !== targetThing.id
        );
        await this.homepageManageService.saveExhibitThings(result);
        // this.exhibitThings = result;
      } catch (error) {
        alert(`儲存失敗，錯誤原因：${error.message}`);
      }
    }
  }
}
