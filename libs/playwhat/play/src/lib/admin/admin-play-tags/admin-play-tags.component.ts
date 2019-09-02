import { xor, isEmpty } from 'lodash';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';
import { PlayTagService } from '../../tag/play-tag.service';
import { PlayAdminService } from '../play-admin.service';
import { PlayTag } from '../../tag/play-tag';


@Component({
  selector: 'ygg-admin-play-tags',
  templateUrl: './admin-play-tags.component.html',
  styleUrls: ['./admin-play-tags.component.css']
})
export class AdminPlayTagsComponent implements OnInit, OnDestroy {
  selected: PlayTag[];
  unselected: PlayTag[];
  subscriptions: Subscription[] = [];
  // newTagName: string;

  constructor(
    private playTagService: PlayTagService,
    private playAdminService: PlayAdminService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      combineLatest([
        this.playTagService.list$(),
        this.playTagService.playTags$
      ]).subscribe(([tagsAll, tagsSelected]) => {
        this.selected = (tagsSelected.toTags() as PlayTag[]);
        const selectedIds = this.selected.map(tag => tag.id);
        this.unselected = tagsAll.filter(tag => selectedIds.indexOf(tag.id) < 0);
      })
    );
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onItemsGroupSwitcherSubmit(payload) {
    if (payload.right && !isEmpty(payload)) {
      this.submit(payload.right);
    }
  }

  async submit(selected: PlayTag[]) {
    if (confirm('確定要修改體驗標籤的設定嗎？')) {
      await this.playAdminService.setData<string[]>('tags', selected.map(tag => tag.id));
      alert('修改完成');
    }
  }

  async addNewTag(newTagName) {
    if (newTagName) {
      await this.playTagService.upsert(new PlayTag(newTagName));
    }
  }
}
