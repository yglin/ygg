import { isEmpty, noop, find, remove } from 'lodash';
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  forwardRef
} from '@angular/core';
import {
  FormControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { TheThing, TheThingFilter } from '@ygg/the-thing/core';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
// import { MatDialogRef } from '@angular/material/dialog';
import {
  of,
  combineLatest,
  Subscription,
  BehaviorSubject,
  Observable,
  Subject
} from 'rxjs';
import { debounceTime, switchMap, startWith } from 'rxjs/operators';
import { YggDialogContentComponent } from '@ygg/shared/ui/widgets';

@Component({
  selector: 'the-thing-finder',
  templateUrl: './the-thing-finder.component.html',
  styleUrls: ['./the-thing-finder.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TheThingFinderComponent),
      multi: true
    }
  ]
})
export class TheThingFinderComponent
  implements
    OnInit,
    OnDestroy,
    ControlValueAccessor,
    YggDialogContentComponent {
  @Input() theThings: TheThing[];
  @Input() theThings$: Observable<TheThing[]>;
  @Input() singleSelect: boolean;
  @Input() filter: TheThingFilter;
  @Input() hideFilter: boolean;
  @Output() selectChange = new EventEmitter<TheThing[]>();
  @Output() selectTheThing = new EventEmitter<TheThing>();
  @Output() deselectTheThing = new EventEmitter<TheThing>();
  emitChange: (changes: TheThing[]) => any = noop;
  filter$: BehaviorSubject<TheThingFilter> = new BehaviorSubject(null);
  filteredTheThings: TheThing[] = [];
  formControlTypesFilter: FormControl;
  formControlSearchName: FormControl;
  subscriptions: Subscription[] = [];
  selection: TheThing[] = [];
  isDialog = false;
  dialogData: any;
  dialogSubmit$: Subject<TheThing[]> = new Subject();

  constructor(private theThingAccessService: TheThingAccessService) {}

  writeValue(value: TheThing[]) {
    if (isEmpty(value)) {
      this.selection = [];
    } else {
      this.selection = value;
    }
  }

  registerOnChange(fn) {
    this.emitChange = fn;
  }

  registerOnTouched(fn) {}

  ngOnInit() {
    this.singleSelect =
      this.singleSelect !== undefined && this.singleSelect !== false;
    this.hideFilter =
      this.hideFilter !== undefined && this.hideFilter !== false;
    if (!this.theThings$) {
      if (this.theThings) {
        this.theThings$ = of(this.theThings);
      } else {
        this.theThings$ = this.theThingAccessService.list$();
      }
    }
    this.subscriptions.push(
      combineLatest([this.theThings$, this.filter$]).subscribe(
        ([theThings, filter]) => {
          if (this.filter) {
            filter = this.filter.merge(filter);
          }
          if (filter) {
            this.filteredTheThings = (filter as TheThingFilter).filter(
              theThings
            );
          } else {
            this.filteredTheThings = theThings;
          }
        }
      )
    );
    if (this.filter) {
      this.filter$.next(this.filter);
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onFilterChanged(filter: TheThingFilter) {
    this.filter$.next(filter);
  }

  onSelectTheThings(selection: TheThing[]) {
    this.selection = selection;
    this.emitChange(selection);
  }

  onSubmit() {
    this.dialogSubmit$.next(this.selection);
  }
}
