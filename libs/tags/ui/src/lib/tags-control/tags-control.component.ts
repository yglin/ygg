import { find, isArray, isEmpty, without, xor } from 'lodash';
import { Component, OnDestroy, forwardRef, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl
} from '@angular/forms';
import { Subscription, noop, Observable, throwError, Subject } from 'rxjs';
import { Tags, Tag } from '@ygg/tags/core';
import { map, switchMap } from 'rxjs/operators';
import { YggDialogContentComponent } from '@ygg/shared/ui/widgets';
import { TagsAccessorService } from '../tags-accessor.service';
import { TagsFactoryService } from '../tags-factory.service';

@Component({
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
  implements
    OnInit,
    OnDestroy,
    ControlValueAccessor,
    YggDialogContentComponent {
  @Input() label: string = "輸入標籤";
  @Input() taggableType: string;
  optionTags$: Observable<Tag[]>;
  optionTags: string[] = [];
  chipsControl: FormControl;
  topTags: Tag[] = [];

  emitChange: (value: Tags) => any = noop;

  subscriptions: Subscription[] = [];

  constructor(
    private tagsAccessor: TagsAccessorService,
    private tagsFactory: TagsFactoryService
  ) {
    this.subscriptions.push(
      this.tagsFactory
        .listTopPopular$()
        .subscribe(tags => (this.topTags = tags))
    );
  }

  dialogData: any;
  dialogOutput$: Subject<Tags> = new Subject();

  ngOnInit() {
    if (!this.optionTags$) {
      this.optionTags$ = this.tagsAccessor.listAll$();
    }
    // console.log(`Taggable type = ${this.taggableType}, optionTags$ = ${this.optionTags$}`);
    if (this.optionTags$) {
      this.subscriptions.push(
        this.optionTags$.subscribe(tags => {
          if (!isEmpty(tags)) {
            this.optionTags = tags.map(tag => tag.id);
          } else {
            this.optionTags = [];
          }
        })
      );
    }

    this.chipsControl = new FormControl([]);
    this.subscriptions.push(
      this.chipsControl.valueChanges.subscribe(chips => {
        const tags = new Tags(chips);
        // console.log('TagsControlComponent: emit change');
        // console.log(tags);
        this.emitChange(tags);
        this.dialogOutput$.next(tags);
      })
    );

    if (
      this.dialogData &&
      this.dialogData.tags &&
      Tags.isTags(this.dialogData.tags)
    ) {
      this.writeValue(this.dialogData.tags);
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  writeValue(value: Tags | string[]) {
    if (Tags.isTags(value)) {
      this.chipsControl.setValue(value.tags);
    } else {
      this.chipsControl.setValue(value);
    }
  }

  registerOnChange(fn) {
    this.emitChange = fn;
  }

  registerOnTouched() {}

  isTopTagSelected(tag: string): boolean {
    const chips: string[] = this.chipsControl.value;
    return !isEmpty(chips) && chips.includes(tag);
  }

  onClickTopTag(tag: string) {
    const chips: string[] = this.chipsControl.value;
    const chipsChanged: string[] = xor(chips, [tag]);
    this.chipsControl.setValue(chipsChanged);
  }
}
