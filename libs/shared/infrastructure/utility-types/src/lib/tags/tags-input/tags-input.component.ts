import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {AfterViewInit, Component, ElementRef, forwardRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent} from '@angular/material';
import {combineLatest, fromEvent, Observable, of, Subscription} from 'rxjs';
import {debounceTime, startWith} from 'rxjs/operators';

import {Tags} from '../tags';

@Component({
  selector: 'ygg-tags-input',
  templateUrl: './tags-input.component.html',
  styleUrls: ['./tags-input.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TagsInputComponent),
    multi: true
  }]
})
export class TagsInputComponent implements OnInit, OnDestroy, AfterViewInit,
                                           ControlValueAccessor {
  @Input() label: string;
  @Input() tagsSource$: Observable<Tags>;
  tagsSource: string[];
  inputControl: FormControl;
  private _tags: Tags;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  subscriptions: Subscription[];

  @ViewChild('tagInput') tagInput: ElementRef;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor() {
    this.inputControl = new FormControl();
    this.subscriptions = [];
  }

  get tags(): string[] {
    return this._tags.values;
  }

  onChange: (tags: Tags) => {};
  onTouched: () => {};

  notifyValueChange(): void {
    if (this.onChange) {
      this.onChange(this._tags);
    }
  }

  ngOnInit(): void {
    if (!this.tagsSource$) {
      this.tagsSource$ = of(new Tags([]));
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    const combined = combineLatest([
      this.tagsSource$,
      fromEvent<KeyboardEvent>(this.tagInput.nativeElement, 'keyup')
          .pipe(startWith(null), debounceTime(500))
    ]);
    const subscription = combined.subscribe(([tags,]) => {
      const inputValue = this.inputControl.value;
      if (inputValue) {
        this.tagsSource = tags.values.filter(value => {
          return value.includes(inputValue);
        });
      } else {
        this.tagsSource = tags.values;
      }
    });
    this.subscriptions.push(subscription);
  }

  writeValue(value: Tags): void {
    this._tags = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {}

  add(event: MatChipInputEvent) {
    const value = (this.inputControl.value || '').trim();
    if (value) {
      this._tags.add(value);
      this.notifyValueChange();
    }
    // Reset the input value
    this.inputControl.setValue(null);
  }

  remove(tag: string) {
    this._tags.delete(tag);
    this.notifyValueChange();
  }

  addSelected(event: MatAutocompleteSelectedEvent): void {
    this._tags.add(event.option.viewValue);
    this.notifyValueChange();
  }
}
