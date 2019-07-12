import { xor } from 'lodash';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';
import { Tags } from '@ygg/shared/types';
import { PlayTagService } from '../../tag/play-tag.service';
import { PlayAdminService } from '../play-admin.service';

@Component({
  selector: 'ygg-admin-play-tags',
  templateUrl: './admin-play-tags.component.html',
  styleUrls: ['./admin-play-tags.component.css']
})
export class AdminPlayTagsComponent implements OnInit, OnDestroy {
  selected: Tags;
  unselected: Tags;
  subscriptions: Subscription[] = [];
  constructor(
    private playTagService: PlayTagService,
    private playAdminService: PlayAdminService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      combineLatest(
        this.playTagService.listAllTagNames$(),
        this.playAdminService.getTags$()
      ).subscribe(([tagsAll, tagsSelected]) => {
        this.selected = tagsSelected;
        this.unselected = new Tags(xor(tagsAll.values, tagsSelected.values));
      })
    );
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onTagsGroupSwitchSubmit([unselected, selected]) {
    this.submit(new Tags(selected));
  }

  async submit(selected: Tags) {
    await this.playAdminService.setTags(selected);
  }
}
