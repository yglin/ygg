import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  NgZone
} from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription, of, fromEvent, BehaviorSubject, Subject } from 'rxjs';
import {
  switchMap,
  filter,
  auditTime,
  tap,
  debounceTime,
  delay
} from 'rxjs/operators';
import { fadeOutAnimation } from './animations';

@Component({
  selector: 'the-thing-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [fadeOutAnimation]
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'playwhat';
  loggedIn = false;
  subscriptions: Subscription[] = [];
  pageClass = 'pw-page';
  showGoToTopButton$: Subject<boolean> = new Subject();
  showGoToTopButton = false;
  @ViewChild('page', { static: false }) pageElement: ElementRef;

  constructor(
    private router: Router,
  ) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.pageElement) {
      this.subscriptions.push(
        fromEvent(this.pageElement.nativeElement, 'scroll')
          // .pipe(debounceTime(300))
          .subscribe(() => {
            const isOnTop = this.pageElement.nativeElement.scrollTop <= 100;
            if (!isOnTop && !this.showGoToTopButton) {
              this.showGoToTopButton$.next(true);
            }
          })
      );
      this.subscriptions.push(
        this.showGoToTopButton$
          .pipe(
            tap(() => (this.showGoToTopButton = true)),
            debounceTime(3000)
          )
          .subscribe(() => {
            if (this.showGoToTopButton) {
              this.showGoToTopButton = false;
            }
          })
      );
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  scrollToTop() {
    if (this.pageElement) {
      const scrollToTop = window.setInterval(() => {
        const pos = this.pageElement.nativeElement.scrollTop;
        const step = Math.max(pos / 10, 5);
        // console.log(`FUCK~!!! ${pos}`);
        if (pos > 0) {
          this.pageElement.nativeElement.scrollTop = pos - step; // how far to scroll on each step
        } else {
          clearInterval(scrollToTop);
        }
      }, 10);
    }
  }

  onActivate(event) {
    this.scrollToTop();
  }
}
