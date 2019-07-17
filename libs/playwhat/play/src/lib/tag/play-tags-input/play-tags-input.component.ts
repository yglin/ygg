import { isEmpty } from 'lodash';
import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PlayTag } from '../play-tag';
import { Tag } from '@ygg/shared/types';
import { Observable } from 'rxjs';
import { PlayTagService } from '../play-tag.service';
import { PlayAdminService } from '../../admin/play-admin.service';

@Component({
  selector: 'ygg-play-tags-input',
  templateUrl: './play-tags-input.component.html',
  styleUrls: ['./play-tags-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PlayTagsInputComponent),
      multi: true
    }
  ]
})
export class PlayTagsInputComponent implements ControlValueAccessor, OnInit {
  tags: Tag[] = [];
  tagsSource$: Observable<Tag[]>;
  onChange: (tags: string[]) => {};
  onTouched: () => {};

  constructor(
    private playAdminService: PlayAdminService,
    private playTagService: PlayTagService
  ) {}

  ngOnInit() {
    this.tagsSource$ = this.playAdminService.getPlayTags$();
  }

  writeValue(tags: string[]) {
    if (!isEmpty(tags)) {
      this.tags = tags.map(tagName => new Tag(tagName));
    }
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {}

  notifyChange(): void {
    if (this.onChange) {
      this.onChange(this.tags.map(tag => tag.name));
    }
  }

  onTagInputChanged(tags: Tag[]) {
    this.tags = tags;
    this.notifyChange();
  }

  async upsertTags() {
    const newPlayTags: PlayTag[] = this.tags.map(tag => new PlayTag(tag.name));
    await this.playTagService.upsertList(newPlayTags);
  }
}
