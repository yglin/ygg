import {
  Component,
  OnDestroy,
  forwardRef,
  Input,
  OnInit
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl
} from '@angular/forms';
import {
  Subscription,
  noop,
  Observable,
} from 'rxjs';
import { Tags } from '../tags';
// import { Tag } from '../../tag';
import { TagService } from '../../tag.service';

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
  implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() label: string;
  @Input() taggableType: string;
  optionTags$: Observable<Tags>;
  optionTags: string[] = [];
  chipsControl: FormControl;

  emitChange: (value: Tags) => any = noop;

  subscriptions: Subscription[] = [];

  constructor(private tagService: TagService) {}

  ngOnInit() {
    if (this.taggableType && !this.optionTags$) {
      this.optionTags$ = this.tagService.getOptionTags$(this.taggableType);
    }
    // console.log(`Taggable type = ${this.taggableType}, optionTags$ = ${this.optionTags$}`);
    if (this.optionTags$) {
      this.subscriptions.push(
        this.optionTags$.subscribe(tags => {
          if (Tags.isTags(tags)) {
            this.optionTags = tags.toNameArray();
          }
        })
      );
    }

    this.chipsControl = new FormControl([]);
    this.subscriptions.push(
      this.chipsControl.valueChanges.subscribe(chips =>
        this.emitChange(new Tags(chips))
      )
    );
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  writeValue(value: Tags) {
    if (Tags.isTags(value)) {
      this.chipsControl.setValue(value.toNameArray());
    }
  }

  registerOnChange(fn) {
    this.emitChange = fn;
  }

  registerOnTouched() {}

}
