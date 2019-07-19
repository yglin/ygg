import { isEmpty, find, remove } from 'lodash';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipEvent } from '@angular/material/chips';
import { combineLatest, fromEvent, Observable, of, Subscription } from 'rxjs';
import {
  debounceTime,
  startWith,
  distinctUntilChanged,
  tap,
  map,
  filter
} from 'rxjs/operators';

import { Tag } from '../tags';

@Component({
  selector: 'ygg-tags-input',
  templateUrl: './tags-input.component.html',
  styleUrls: ['./tags-input.component.css']
})
export class TagsInputComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() label: string;
  @Input() tagsSource$: Observable<Tag[]>;
  @Input() tags: Tag[] = [];
  @Output() changed: EventEmitter<Tag[]> = new EventEmitter();
  tagsForAutoComplete: Tag[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  subscriptions: Subscription[];

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

  minCountOfLettersForAutoComplete = 2;

  @ViewChild('tagInput', { static: false }) tagInput: ElementRef;
  @ViewChild('tagInput', { read: MatAutocompleteTrigger, static: false })
  matAutocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor() {
    this.subscriptions = [];
  }

  notifyValueChange(): void {
    this.changed.emit(this.tags);
  }

  ngOnInit(): void {
    if (!this.tagsSource$) {
      this.tagsSource$ = of([]);
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    const inputKeyword$: Observable<string> = fromEvent<KeyboardEvent>(
      this.tagInput.nativeElement,
      'keyup'
    ).pipe(
      map(keyboardEvent => (<HTMLInputElement>keyboardEvent.target).value),
      startWith(''),
      debounceTime(500),
      distinctUntilChanged()
    );

    const subscription = combineLatest([
      this.tagsSource$,
      inputKeyword$
    ]).subscribe(([tagsSource, inputKeyword]) => {
      // console.log(tagsSource);
      // console.log(inputKeyword);

      // Things changed, close autocomplete panel in advance
      this.isDisplayAutocompleteSelector = false;
      if (
        inputKeyword &&
        inputKeyword.length >= this.minCountOfLettersForAutoComplete
      ) {
        this.tagsForAutoComplete = tagsSource.filter(tag =>
          tag.name.includes(inputKeyword)
        );
        if (this.tagsForAutoComplete.length > 0) {
          // Open autocomplete panel, only when input over 2 letters and matched
          this.isDisplayAutocompleteSelector = true;
        }
      } else {
        this.tagsForAutoComplete = tagsSource;
      }
    });
    this.subscriptions.push(subscription);
  }

  addTag(name: string) {
    name = (name || '').trim();
    if (name && !find(this.tags, tag => tag.name === name)) {
      this.tags.push(new Tag(name));
      this.notifyValueChange();
    }
  }

  removeTag(name: string) {
    remove(this.tags, tag => tag.name === name);
    this.notifyValueChange();
  }

  addChip(event: MatChipInputEvent) {
    this.addTag(event.value);
  }

  removeChip(event: MatChipEvent) {
    this.removeTag((event.chip.value as Tag).name);
  }

  addSelected(event: MatAutocompleteSelectedEvent): void {
    const name = (event.option.value as Tag).name;
    this.addTag(name);
  }

  toggleAutoComplete(event: MouseEvent) {
    event.stopPropagation();
    this.isDisplayAutocompleteSelector = !(this.isDisplayAutocompleteSelector);
  }
}
