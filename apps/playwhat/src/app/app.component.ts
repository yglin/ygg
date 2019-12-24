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
import {
  AuthenticateService,
  AuthorizeService,
  UserMenuService,
  UserMenuItem,
  User
} from '@ygg/shared/user';
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
  selector: 'pw-root',
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
    private authenticateService: AuthenticateService,
    private authorizeService: AuthorizeService,
    private userMenuService: UserMenuService,
    private router: Router,
    private zone: NgZone,
    private route: ActivatedRoute,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit() {
    let subscription = this.authenticateService.currentUser$
      .pipe(
        switchMap(currentUser => {
          if (User.isUser(currentUser)) {
            this.loggedIn = true;
            // Check user admin
            return this.authorizeService.isAdmin(currentUser.id);
          } else {
            if (this.loggedIn) {
              this.loggedIn = false;
              // User logout, redirect to home page
              this.router.navigate(['home']);
            }
            return of(false);
          }
        })
      )
      .subscribe(isAdmin => {
        const adminMenuItem: UserMenuItem = {
          id: 'admin',
          icon: 'business',
          label: '站務管理',
          link: 'admin'
        };
        if (isAdmin) {
          this.userMenuService.addItem(adminMenuItem);
        } else {
          this.userMenuService.removeItem(adminMenuItem.id);
        }
      });
    // Register user-menu-item admin
    this.subscriptions.push(subscription);

    subscription = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // console.log(event.url);
        if (/^\/?admin(\/.+)*$/.test(event.url)) {
          this.pageClass = 'pw-page-admin';
        } else {
          this.pageClass = 'pw-page';
        }
      });
    this.subscriptions.push(subscription);
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
            // switchMap(() => of(true)),
            // delay(3000)
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
      let scrollToTop = window.setInterval(() => {
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
