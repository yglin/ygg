import { find, isEmpty } from 'lodash';
import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import { Tag } from '@ygg/tags/core';
import { TagsService } from '@ygg/tags/data-access';
import { Subscription, combineLatest } from 'rxjs';
import { FormControl } from '@angular/forms';
import { auditTime, startWith, distinctUntilChanged } from 'rxjs/operators';
import {
  MatSelectionListChange,
  MatSelectionList
} from '@angular/material/list';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'ygg-tags-admin-list',
  templateUrl: './tags-admin-list.component.html',
  styleUrls: ['./tags-admin-list.component.css']
})
export class TagsAdminListComponent
  implements OnInit, OnDestroy, AfterViewInit {
  tags: Tag[] = [];
  selectedTags: Tag[] = [];
  subscriptions: Subscription[] = [];
  searchControl: FormControl = new FormControl('');
  @ViewChild('list', { static: false }) tagsList: MatSelectionList;
  isAddNewTagButtonDisabled = true;
  isRemoveTagsButtonDisabled = true;

  constructor(private tagsService: TagsService) {
    const searchChange$ = this.searchControl.valueChanges.pipe(
      auditTime(500),
      startWith(''),
      distinctUntilChanged()
    );

    this.subscriptions.push(
      combineLatest([this.tagsService.tags$, searchChange$]).subscribe(
        ([tags, searchText]) => {
          this.isAddNewTagButtonDisabled = true;
          this.isRemoveTagsButtonDisabled = true;
          if (this.tagsList) {
            this.tagsList.selectedOptions.clear();
          }
          if (searchText) {
            // console.log(tags);
            this.tags = tags.filter(tag => tag.name.includes(searchText));
            if (isEmpty(this.tags)) {
              this.isAddNewTagButtonDisabled = false;
            }
          } else {
            this.tags = tags;
          }
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

  ngAfterViewInit() {
    this.subscriptions.push(
      this.tagsList.selectedOptions.changed.subscribe(() => {
        this.isRemoveTagsButtonDisabled = this.tagsList.selectedOptions.isEmpty();
      })
    );
  }

  // onChangeSelection(selection: MatSelectionListChange) {
  //   if (this.tagsList) {
  //     this.selectedTags = this.tagsList.selectedOptions
  //   }
  // }

  async addNewTag() {
    const newTag = new Tag(this.searchControl.value);
    if (confirm(`確定要新增標籤：${newTag.name}？`)) {
      await this.tagsService.upsert([newTag]);
      this.searchControl.setValue('');
    }
    return Promise.resolve();
  }

  removeSelectedTags() {
    const selectedTags: Tag[] = this.tagsList.selectedOptions.selected.map(
      option => {
        const id = option.value;
        return find(this.tags, tag => tag.id === id);
      }
    );
    if (
      confirm(
        `確定要刪除以下標籤？ \n${selectedTags.map(tag => tag.name).join('，')}`
      )
    ) {
      this.tagsService.delete(selectedTags);
    }
  }
}
