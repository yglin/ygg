import {
  Component,
  OnDestroy,
  forwardRef,
  Input,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Subscription,
  noop,
  Observable,
  fromEvent,
  combineLatest,
  of,
  isObservable,
  merge
} from 'rxjs';
import { Tags, Tag } from '../tags'; // !! Correct import path
import {
  MatAutocompleteTrigger,
  MatAutocomplete,
  MatAutocompleteSelectedEvent
} from '@angular/material/autocomplete';
import {
  map,
  startWith,
  debounceTime,
  distinctUntilChanged,
  tap,
  filter
} from 'rxjs/operators';
import { MatChipInputEvent, MatChipEvent } from '@angular/material/chips';

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
  implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {
  @Input() label: string;
  @Input() autocompleteTags: Observable<Tags> | Tags;
  autocompleteTags$: Observable<Tags>;
  tagsForAutoComplete: string[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];

  tags: Tags = new Tags();

  // private _tags: Tags = new Tags();
  // set tags(value: Tags) {
  //   if (value) {
  //     this._tags = value;
  //     this.emitChange(this._tags);
  //   }
  // }
  // get tags(): Tags {
  //   return this._tags;
  // }
  emitChange: (value: Tags) => any = noop;

  subscriptions: Subscription[] = [];
  @ViewChild('tagInput', { static: false }) tagInput: ElementRef;
  @ViewChild('tagInput', { read: MatAutocompleteTrigger, static: false })
  matAutocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  minCountOfLettersForAutoComplete = 2;
  _isDisplayAutocompleteSelector: boolean = false;
  set isDisplayAutocompleteSelector(value: boolean) {
    this._isDisplayAutocompleteSelector = !!value;
    if (this.matAutocompleteTrigger) {
      if (this._isDisplayAutocompleteSelector) {
        this.matAutocompleteTrigger.openPanel();
      } else {
        this.matAutocompleteTrigger.closePanel();
      }
    }
  }
  get isDisplayAutocompleteSelector(): boolean {
    return this._isDisplayAutocompleteSelector;
  }

  constructor() {}

  ngOnInit() {
    if (Tags.isTags(this.autocompleteTags)) {
      this.autocompleteTags$ = of(this.autocompleteTags);
    } else if (isObservable(this.autocompleteTags)) {
      this.autocompleteTags$ = this.autocompleteTags.pipe(
        filter(value => Tags.isTags(value))
      );
    } else {
      this.autocompleteTags$ = of(new Tags());
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  writeValue(value: Tags) {
    if (Tags.isTags(value)) {
      this.tags = value;
    }
  }

  registerOnChange(fn) {
    this.emitChange = fn;
  }

  registerOnTouched() {}

  ngAfterViewInit() {
    const inputKeyword$: Observable<string> = merge(
      fromEvent<KeyboardEvent>(this.tagInput.nativeElement, 'keyup'),
      fromEvent<Event>(this.tagInput.nativeElement, 'input')
    ).pipe(
      // tap(keyboardEvent => console.log(keyboardEvent)),
      map(keyboardEvent => (<HTMLInputElement>keyboardEvent.target).value),
      startWith(''),
      debounceTime(500),
      distinctUntilChanged(),
      // tap(text => console.log(`Input ... ${text}`))
    );

    const subscription = combineLatest([
      this.autocompleteTags$,
      inputKeyword$
    ]).subscribe(([autocompleteTagsSource, inputKeyword]) => {
      // Things changed, close autocomplete panel in advance
      this.isDisplayAutocompleteSelector = false;
      if (
        inputKeyword &&
        inputKeyword.length >= this.minCountOfLettersForAutoComplete
      ) {
        // console.dir(autocompleteTagsSource.getNames());
        this.tagsForAutoComplete = autocompleteTagsSource
          .filter(tag => tag.name.includes(inputKeyword))
          .getNames();
        // console.dir(this.tagsForAutoComplete);
        if (this.tagsForAutoComplete.length > 0) {
          // Open autocomplete panel, only when input over 2 letters and matched
          this.isDisplayAutocompleteSelector = true;
        }
      } else {
        this.tagsForAutoComplete = autocompleteTagsSource.getNames();
      }
    });
    this.subscriptions.push(subscription);
  }

  clearTags() {
    this.tags.clear();
    this.emitChange(this.tags);
  }

  addTag(name?: string) {
    if (!name) {
      name = this.tagInput.nativeElement.value;
    }
    if (name) {
      name = (name || '').trim();
      this.tags.push(name);
      this.emitChange(this.tags);
    }
  }

  removeTag(name: string) {
    this.tags.remove(name);
    this.emitChange(this.tags);
  }

  addChip(event: MatChipInputEvent) {
    this.addTag(event.value);
  }

  removeChip(event: MatChipEvent) {
    this.removeTag(event.chip.value);
  }

  addSelected(event: MatAutocompleteSelectedEvent): void {
    this.addTag(event.option.value);
  }

  toggleAutoComplete(event: MouseEvent) {
    event.stopPropagation();
    this.isDisplayAutocompleteSelector = !this.isDisplayAutocompleteSelector;
  }
}
