import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import { fadeOutAnimation } from '@ygg/shared/ui/widgets';
import {
  fromEvent,
  Subject,
  Subscription,
  Observable,
  isObservable
} from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { MatDrawer } from '@angular/material/sidenav';
import { SideDrawerService } from '../side-drawer/side-drawer.service';

@Component({
  selector: 'ygg-layout-page-classic',
  templateUrl: './layout-page-classic.component.html',
  styleUrls: ['./layout-page-classic.component.css'],
  animations: [fadeOutAnimation]
})
export class LayoutPageClassicComponent implements OnInit {
  @Input() backgroundImage: string;
  @Input() backgroundMaskColor: string;
  @Input() scrollToTop$: Observable<void>;

  styles = {
    backgroundLayer: {
      'background-image': 'url("/assets/images/background.jpg")'
    },
    backgroundMask: {
      'background-color': 'rgba(0, 0, 0, 0)'
    }
  };
  subscription: Subscription = new Subscription();
  showGoToTopButton$: Subject<boolean> = new Subject();
  showGoToTopButton = false;
  @ViewChild('page', { static: false }) pageElement: ElementRef;
  @ViewChild('drawer', { static: false }) sideDrawer: MatDrawer;

  constructor(private sideDrawerService: SideDrawerService) {}

  ngOnInit() {
    if (this.backgroundImage) {
      this.styles.backgroundLayer[
        'background-image'
      ] = `url("${this.backgroundImage}")`;
    }
    if (this.backgroundMaskColor) {
      this.styles.backgroundMask['background-color'] = this.backgroundMaskColor;
    }
    if (isObservable(this.scrollToTop$)) {
      this.subscription.add(
        this.scrollToTop$.subscribe(() => this.scrollToTop())
      );
    }
  }

  ngAfterViewInit() {
    if (this.pageElement) {
      this.subscription.add(
        fromEvent(this.pageElement.nativeElement, 'scroll')
          // .pipe(debounceTime(300))
          .subscribe(() => {
            const isOnTop = this.pageElement.nativeElement.scrollTop <= 100;
            if (!isOnTop && !this.showGoToTopButton) {
              this.showGoToTopButton$.next(true);
            }
          })
      );
      this.subscription.add(
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
    if (this.sideDrawer) {
      this.sideDrawerService.setSideDrawer(this.sideDrawer);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
}
