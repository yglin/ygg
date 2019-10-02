import { isEmpty, find } from 'lodash';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Tag, TaggableType, Taggable } from '@ygg/tags/core';
import {
  Subscription,
  Subject,
  Observable,
  merge,
  combineLatest,
  throwError
} from 'rxjs';
import { FormControl } from '@angular/forms';
import {
  auditTime,
  startWith,
  distinctUntilChanged,
  filter,
  switchMap,
  tap
} from 'rxjs/operators';
import { TagsService } from '@ygg/tags/data-access';
import { GroupSwitcherChangeEvent } from '@ygg/shared/ui/widgets';
import { TagsAdminService } from '../tags-admin.service';
import { LogService } from '@ygg/shared/infra/log';

@Component({
  selector: 'ygg-tags-admin-user-options',
  templateUrl: './tags-admin-user-options.component.html',
  styleUrls: ['./tags-admin-user-options.component.css']
})
export class TagsAdminUserOptionsComponent implements OnInit, OnDestroy {
  userOptionTags: Tag[];
  tagsAll: Tag[];
  selectedInTagsAll: Tag[] = [];
  subscriptions: Subscription[] = [];
  searchControl: FormControl = new FormControl('');
  isAddNewTagButtonDisabled = true;
  isRemoveTagsButtonDisabled = true;
  userOptionTagsFromGroupSwitcher$: Subject<Tag[]> = new Subject();

  taggableTypes: TaggableType[] = [];
  taggableTypeControl: FormControl = new FormControl();

  // newTagName: string;

  constructor(
    private tagsService: TagsService,
    private tagsAdminService: TagsAdminService,
    private logService: LogService
  ) {
    // Fetch user-option tags
    const fetchUserOptionTags$ = this.taggableTypeControl.valueChanges.pipe(
      // tap(taggableTypeId =>
      //   console.log(`Change taggable type to ${taggableTypeId}`)
      // ),
      switchMap(taggableTypeId => {
        const taggableType = find(
          this.taggableTypes,
          t => t.id === taggableTypeId
        );
        if (taggableType) {
          return this.tagsService.getOptionTags$(taggableType);
        } else {
          const error = new Error(`Unknown Taggable Type ${taggableTypeId}`);
          // console.error(error.message);
          this.logService.error(error.message);
          return throwError(error);
        }
      })
      // tap(userOptionTags => console.log(userOptionTags))
    );
    this.subscriptions.push(
      merge(
        fetchUserOptionTags$,
        this.userOptionTagsFromGroupSwitcher$
      ).subscribe(userOptionTags => (this.userOptionTags = userOptionTags))
    );

    // Fetch taggable types
    this.subscriptions.push(
      this.tagsService.getTaggableTypes$().subscribe(taggableTypes => {
        this.taggableTypes = taggableTypes;
        if (!isEmpty(this.taggableTypes) && !this.taggableTypeControl.value) {
          this.taggableTypeControl.setValue(this.taggableTypes[0].id);
        }
      })
    );

    // Fetch all tags, accounting filter result
    const filterNameChange$ = this.searchControl.valueChanges.pipe(
      auditTime(500),
      startWith(''),
      distinctUntilChanged()
    );
    this.subscriptions.push(
      combineLatest([this.tagsService.tags$, filterNameChange$]).subscribe(
        ([tagsAll, filterName]) => {
          this.tagsAll = tagsAll.filter(tag =>
            filterName ? tag.name.includes(filterName) : true
          );
        }
      )
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onSwitchTagsGroup(event: GroupSwitcherChangeEvent) {
    this.userOptionTagsFromGroupSwitcher$.next(event.right as Tag[]);
  }

  onSelectInAll(tags: Tag[]) {
    this.selectedInTagsAll = tags;
    this.isRemoveTagsButtonDisabled = isEmpty(this.selectedInTagsAll);
    // console.log(`Selected in left: ${this.userOptionTagsInUnuserOptionTags.map(tag => tag.name).join(',')}`);
  }

  async onSaveSelected() {
    if (confirm('確定要修改選單標籤？')) {
      const taggableType: TaggableType = find(
        this.taggableTypes,
        t => t.id === this.taggableTypeControl.value
      );
      await this.tagsAdminService.saveUserOptionTags(
        taggableType,
        this.userOptionTags
      );
      alert('修改完成');
    }
  }
}
