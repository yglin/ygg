import { noop, find, remove } from 'lodash';
import {
  Component,
  OnInit,
  Input,
  forwardRef,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  OnChanges
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatChipEvent, MatChipInputEvent } from '@angular/material/chips';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatAutocomplete
} from '@angular/material/autocomplete';
import {
  Observable,
  merge,
  fromEvent,
  Subscription,
  BehaviorSubject,
  combineLatest
} from 'rxjs';
import {
  map,
  startWith,
  debounceTime,
  distinctUntilChanged
} from 'rxjs/operators';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

@Component({
  selector: 'ygg-chips-control',
  templateUrl: './chips-control.component.html',
  styleUrls: ['./chips-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChipsControlComponent),
      multi: true
    }
  ]
})
export class ChipsControlComponent
  implements OnInit, OnDestroy, AfterViewInit, ControlValueAccessor {
  @Input() label: string;
  @Input() autocompleteOptions: string[] = [];
  @Input() chipMinLength = 2;
  autocompleteOptionsFiltered: string[] = [];
  emitChange: (chips: string[]) => any = noop;
  chips: string[] = [];
  subscriptions: Subscription[] = [];
  @ViewChild('chipInput', { static: false }) chipInput: ElementRef;
  @ViewChild('chipInput', { read: MatAutocompleteTrigger, static: false })
  matAutocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  showButtonAdd = false;
  showButtonClearAll = false;

  _isDisplayAutocompleteSelector = false;
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

  ngOnInit() {}

  ngAfterViewInit() {
    const inputKeyword$: Observable<string> = merge(
      fromEvent<KeyboardEvent>(this.chipInput.nativeElement, 'keyup'),
      fromEvent<Event>(this.chipInput.nativeElement, 'input')
    ).pipe(
      map(keyboardEvent => (<HTMLInputElement>keyboardEvent.target).value),
      startWith(''),
      debounceTime(500),
      distinctUntilChanged()
    );

    const subscription = inputKeyword$.subscribe(inputKeyword => {
      // Things changed, close autocomplete panel in advance
      // console.log(inputKeyword);
      this.isDisplayAutocompleteSelector = false;
      if (inputKeyword && inputKeyword.length >= this.chipMinLength) {
        this.showButtonAdd = true;
        // console.log('Show button-add');
        // console.dir(autocompleteTagsSource.getNames());
        // console.log(this.autocompleteOptions);
        this.autocompleteOptionsFiltered = this.autocompleteOptions.filter(
          chip => chip.includes(inputKeyword)
        );
        if (this.autocompleteOptionsFiltered.length > 0) {
          // Open autocomplete panel, only when input over 2 letters and matched
          // console.log(this.autocompleteOptionsFiltered);
          this.isDisplayAutocompleteSelector = true;
        }
      } else {
        this.autocompleteOptionsFiltered = this.autocompleteOptions;
        this.showButtonAdd = false;
      }
    });
    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  writeValue(value: string[]) {
    if (value) {
      this.chips = value;
      this.showButtonClearAll = this.chips.length >= 2;
    }
  }

  registerOnChange(fn) {
    this.emitChange = fn;
  }

  registerOnTouched() {}

  notifyChange() {
    this.showButtonClearAll = this.chips.length >= 2;
    this.emitChange(Array.from(this.chips));
  }

  clearAll() {
    this.chips.length = 0;
    this.notifyChange();
  }

  addChipUnique(chip: string) {
    if (!find(this.chips, _chip => _chip === chip)) {
      this.chips.push(chip);
    }
  }

  addChip(event?: MatChipInputEvent) {
    let chip: string;
    if (event) {
      chip = event.value;
    } else {
      chip = this.chipInput.nativeElement.value;
    }
    if (chip) {
      this.addChipUnique(chip);
      this.notifyChange();
    }
    if (this.chipInput) {
      this.chipInput.nativeElement.value = null;
    }
  }

  addSelected(event: MatAutocompleteSelectedEvent) {
    this.addChipUnique(event.option.value);
    this.notifyChange();
  }

  removeChip(event: MatChipEvent) {
    remove(this.chips, _chip => _chip === event.chip.value);
    this.notifyChange();
  }

  toggleAutoComplete() {
    this.isDisplayAutocompleteSelector = !this.isDisplayAutocompleteSelector;
  }
}
