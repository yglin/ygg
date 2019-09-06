import { isEmpty } from 'lodash';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Subscription,
  combineLatest,
  fromEvent,
  BehaviorSubject,
  Subject,
  Observable,
  merge
} from 'rxjs';
import { PlayTagService } from '../../tag/play-tag.service';
import { PlayAdminService } from '../play-admin.service';
import { PlayTag } from '../../tag/play-tag';
import { FormControl } from '@angular/forms';
import {
  startWith,
  auditTime,
  distinctUntilChanged,
  filter,
  tap
} from 'rxjs/operators';
import { GroupSwitcherChangeEvent } from '@ygg/shared/ui/widgets';

@Component({
  selector: 'ygg-admin-play-tags',
  templateUrl: './admin-play-tags.component.html',
  styleUrls: ['./admin-play-tags.component.css']
})
export class AdminPlayTagsComponent implements OnInit, OnDestroy {
  selected: PlayTag[];
  unselected: PlayTag[];
  selectedInUnselected: PlayTag[] = [];
  subscriptions: Subscription[] = [];
  tagNameControl: FormControl;
  isAddNewTagButtonDisabled = true;
  isRemoveTagsButtonDisabled = true;
  selectedFromGroupSwitcher$: Subject<PlayTag[]> = new Subject();

  // newTagName: string;

  constructor(
    private playTagService: PlayTagService,
    private playAdminService: PlayAdminService
  ) {
    this.tagNameControl = new FormControl();
    const filterNameChange$ = this.tagNameControl.valueChanges.pipe(
      auditTime(500),
      startWith(''),
      distinctUntilChanged()
    );

    const selected$: Observable<PlayTag[]> = merge(
      this.playTagService.playTags$,
      this.selectedFromGroupSwitcher$
    ).pipe(filter(playTags => !isEmpty(playTags)));

    this.subscriptions.push(
      combineLatest([
        this.playTagService.list$(),
        selected$,
        filterNameChange$
      ]).subscribe(([tagsAll, tagsSelected, filterName]) => {
        this.selected = tagsSelected;
        const selectedIds = this.selected.map(tag => tag.id);
        this.unselected = tagsAll
          .filter(tag => selectedIds.indexOf(tag.id) < 0)
          .filter(tag => (filterName ? tag.name.includes(filterName) : true));
        this.isAddNewTagButtonDisabled = this.unselected.length > 0;
      })
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onSwitchTagsGroup(event: GroupSwitcherChangeEvent) {
    this.selectedFromGroupSwitcher$.next(event.right as PlayTag[]);
  }

  onSelectInUnselected(selectedTags: PlayTag[]) {
    this.selectedInUnselected = selectedTags;
    this.isRemoveTagsButtonDisabled = isEmpty(this.selectedInUnselected);
    // console.log(`Selected in left: ${this.selectedInUnselected.map(tag => tag.name).join(',')}`);
  }

  async onSaveSelected() {
    if (confirm('確定要修改選單標籤？')) {
      await this.playAdminService.setData<string[]>(
        'tags',
        this.selected.map(tag => tag.id)
      );
      alert('修改完成');
    }
  }

  async addNewTag() {
    const newTagName = this.tagNameControl.value;
    const confirmMessage = `確定要新增標籤 "${newTagName}"？`;
    if (newTagName && confirm(confirmMessage)) {
      await this.playTagService.upsert(new PlayTag(newTagName));
    }
  }

  async removeSelectedTags() {
    const confirmMessage = `確定要刪除以下標籤 "${this.selectedInUnselected
      .map(tag => tag.name)
      .join(',')}"？`;
    if (!isEmpty(this.selectedInUnselected) && confirm(confirmMessage)) {
      await this.playTagService.deleteList(this.selectedInUnselected);
    }
  }
}
