import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ViewportScroller } from "@angular/common";
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import {
  AuthenticateService,
  AuthorizeService,
  UserMenuService,
  UserMenuItem,
  User
} from '@ygg/shared/user';
import { Subscription, of, fromEvent } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';

@Component({
  selector: 'pw-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'playwhat';
  loggedIn = false;
  subscriptions: Subscription[] = [];
  pageClass = 'pw-page';
  isOnTop = true;
  @ViewChild('page', {static: false}) pageElement: ElementRef;

  constructor(
    private authenticateService: AuthenticateService,
    private authorizeService: AuthorizeService,
    private userMenuService: UserMenuService,
    private router: Router,
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

    subscription = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
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
      fromEvent(this.pageElement.nativeElement, 'scroll').subscribe(() => {
        // console.log(this.pageElement.nativeElement.scrollTop);
        this.isOnTop = this.pageElement.nativeElement.scrollTop <= 100;
      });
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  scrollToTop() {
    if (this.pageElement) {
      this.pageElement.nativeElement.scrollTop = 0;
    }
  }
}
