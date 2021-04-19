import { find, isArray } from 'lodash';
import { Component, OnDestroy, forwardRef, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl
} from '@angular/forms';
import { Subscription, noop, Observable, throwError } from 'rxjs';
// import { Tags, Tag } from '@ygg/tags/core';
// import { TagsService } from '@ygg/tags/data-access';
import { map, switchMap } from 'rxjs/operators';
import { Tags } from '@ygg/shared/tags/core';
import { TagsFinderService } from '../tags-finder.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ygg-tags-control',
  templateUrl: './tags-control.component.html',
  styleUrls: ['./tags-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagsControlComponent),
      multi: true
    }
  ]
})
export class TagsControlComponent
  implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() label: string;
  topTags: string[] = [];
  // @Input() taggableType: string;
  // optionTags$: Observable<Tag[]>;
  // optionTags: string[] = [];
  chipsControl: FormControl;

  emitChange: (value: Tags) => any = noop;

  subscription: Subscription = new Subscription();

  constructor(private tagsFinder: TagsFinderService) {
    this.subscription.add(
      this.tagsFinder.findTopTags$(20).subscribe(tags => (this.topTags = tags))
    );
  }

  ngOnInit() {
    // if (this.taggableType && !this.optionTags$) {
    //   this.optionTags$ = this.tagsService.getTaggableTypes$().pipe(
    //     switchMap(taggableTypes => {
    //       const taggableType = find(taggableTypes, t => t.id === this.taggableType);
    //       if (taggableType) {
    //         return this.tagsService.getOptionTags$(taggableType);
    //       } else {
    //         const error = new Error(`Not supported taggable type: ${this.taggableType}`);
    //         return throwError(error);
    //       }
    //     })
    //   )
    // }
    // console.log(`Taggable type = ${this.taggableType}, optionTags$ = ${this.optionTags$}`);
    // if (this.optionTags$) {
    //   this.subscriptions.push(
    //     this.optionTags$.subscribe(tags => {
    //       if (isArray(tags)) {
    //         this.optionTags = tags.map(tag => tag.name);
    //       } else {
    //         this.optionTags = [];
    //       }
    //     })
    //   );
    // }

    this.chipsControl = new FormControl([]);
    this.subscription.add(
      this.chipsControl.valueChanges.subscribe(chips => {
        const tags = new Tags(chips);
        this.chipsControl.setValue(tags.getTags(), { emitEvent: false });
        this.emitChange(tags);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  writeValue(value: Tags) {
    if (Tags.isTags(value)) {
      this.chipsControl.setValue(value.getTags());
    }
  }

  registerOnChange(fn) {
    this.emitChange = fn;
  }

  registerOnTouched() {}
}
