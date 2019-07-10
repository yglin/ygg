import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Input
} from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'ygg-reactive-text-input',
  templateUrl: './reactive-text-input.component.html',
  styleUrls: ['./reactive-text-input.component.css']
})
export class ReactiveTextInputComponent implements AfterViewInit, OnDestroy {
  @Input() debounceTime = 1000;
  @Input() placeholder = '';
  @Output() change: EventEmitter<string> = new EventEmitter();
  @ViewChild('input') input: ElementRef;
  subscription: Subscription;

  constructor() {}

  ngAfterViewInit() {
    if (this.input) {
      this.subscription = fromEvent<KeyboardEvent>(
        this.input.nativeElement,
        'keyup'
      )
        .pipe(
          map(event => (<HTMLInputElement>event.target).value),
          startWith(''),
          debounceTime(this.debounceTime),
          distinctUntilChanged()
        )
        .subscribe(this.change);
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
