import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ContentChild
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { YggDialogContentComponent } from '@ygg/shared/ui/widgets';
import {
  TheThing,
  TheThingFilter,
  TheThingImitation
} from '@ygg/the-thing/core';
import { isEmpty, noop, get } from 'lodash';
// import { MatDialogRef } from '@angular/material/dialog';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  Subject,
  Subscription
} from 'rxjs';
import { TheThingAccessService } from '../../the-thing-access.service';
import { switchMap, map, tap } from 'rxjs/operators';
import { Directive } from '@angular/core';

@Directive({
  selector: '[theThingFinderItem]'
})
export class TheThingFinderItemDirective {}

@Component({
  selector: 'the-thing-finder',
  templateUrl: './the-thing-finder.component.html',
  styleUrls: ['./the-thing-finder.component.css']
  // providers: [
  //   {
  //     provide: NG_VALUE_ACCESSOR,
  //     useExisting: forwardRef(() => TheThingFinderComponent),
  //     multi: true
  //   }
  // ]
})
// ControlValueAccessor,
export class TheThingFinderComponent
  implements OnInit, OnDestroy, YggDialogContentComponent {
  // @Input() theThings: TheThing[];
  @Input() theThings$: Observable<TheThing[]>;
  @Input() imitation: TheThingImitation;
  // @Input() singleSelect: boolean;
  @Input() filter: TheThingFilter;
  // @Input() hideFilter: boolean;
  // @Output() selectChange = new EventEmitter<TheThing[]>();
  // @Output() selectTheThing = new EventEmitter<TheThing>();
  // @Output() deselectTheThing = new EventEmitter<TheThing>();
  // emitChange: (changes: TheThing[]) => any = noop;
  filter$: BehaviorSubject<TheThingFilter> = new BehaviorSubject(null);
  // filteredTheThings: TheThing[] = [];
  // formControlTypesFilter: FormControl;
  // formControlSearchName: FormControl;
  // subscriptions: Subscription[] = [];
  // selection: TheThing[] = [];
  // isDialog = false;
  dialogData: { filter: TheThingFilter };
  dialogOutput$: Subject<TheThing[]> = new Subject();
  subscription: Subscription = new Subscription();
  theThings: TheThing[] = [];
  //@ContentChild(TheThingFinderItemDirective, { read: TemplateRef }) theThingItemTemplate;
  @Input() theThingItemTemplate: TemplateRef<any>;

  constructor(private theThingAccessService: TheThingAccessService) {}

  // writeValue(value: TheThing[]) {
  //   if (isEmpty(value)) {
  //     this.selection = [];
  //   } else {
  //     this.selection = value;
  //   }
  // }

  // registerOnChange(fn) {
  //   this.emitChange = fn;
  // }

  // registerOnTouched(fn) {}

  ngOnInit() {
    if (this.dialogData && this.dialogData.filter) {
      this.filter = this.dialogData.filter;
    }
    if (this.filter) {
      this.filter$.next(this.filter);
    }
    if (!this.theThings$) {
      const collection = get(this.imitation, 'collection', TheThing.collection);
      this.theThings$ = this.theThingAccessService.list$(collection);
    }
    this.subscription.add(
      combineLatest([this.theThings$, this.filter$])
        .pipe(
          map(([theThings, filter]) => {
            if (filter) {
              return theThings.filter(theThing => filter.test(theThing));
            } else {
              return theThings;
            }
          }),
          tap(theThings => (this.theThings = theThings))
        )
        .subscribe()
    );
    // this.singleSelect =
    //   this.singleSelect !== undefined && this.singleSelect !== false;
    // this.hideFilter =
    //   this.hideFilter !== undefined && this.hideFilter !== false;
    // if (!this.theThings$) {
    //   if (this.theThings) {
    //     this.theThings$ = of(this.theThings);
    //   } else {
    //     this.theThings$ = this.theThingAccessService.list$();
    //   }
    // }
    // this.subscriptions.push(
    //   combineLatest([this.theThings$, this.filter$]).subscribe(
    //     ([theThings, filter]) => {
    //       if (this.filter) {
    //         filter = this.filter.merge(filter);
    //       }
    //       if (filter) {
    //         this.filteredTheThings = (filter as TheThingFilter).filter(
    //           theThings
    //         );
    //       } else {
    //         this.filteredTheThings = theThings;
    //       }
    //     }
    //   )
    // );
    // if (this.filter) {
    //   this.filter$.next(this.filter);
    // }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    // for (const subscription of this.subscriptions) {
    //   subscription.unsubscribe();
    // }
    this.subscription.unsubscribe();
  }

  onFilterChanged(filter: TheThingFilter) {
    this.filter$.next(filter);
  }

  // onSelectTheThings(selection: TheThing[]) {
  //   this.selection = selection;
  //   this.emitChange(selection);
  //   this.dialogOutput$.next(selection);
  // }
}
