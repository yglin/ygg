import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ImageThumbnailListComponent,
  YggDialogService
} from '@ygg/shared/ui/widgets';
import { AuthenticateService } from '@ygg/shared/user/ui';
import {
  TheThing,
  TheThingFilter,
  TheThingImitation
} from '@ygg/the-thing/core';
import { TheThingAccessService } from '../../the-thing-access.service';
import { isEmpty } from 'lodash';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  Subscription
} from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'the-thing-my-things',
  templateUrl: './my-things.component.html',
  styleUrls: ['./my-things.component.css']
})
export class MyThingsComponent implements OnInit, OnDestroy {
  myThings$: Observable<TheThing[]>;
  // filter: TheThingFilter;
  filter$: BehaviorSubject<TheThingFilter> = new BehaviorSubject(null);
  // filteredTheThings$: Observable<TheThing[]>;
  selection: TheThing[] = [];
  // filterChange$: BehaviorSubject<TheThingFilter> = new BehaviorSubject(new TheThingFilter());
  subscriptions: Subscription[] = [];
  imitations: TheThingImitation[] = [];
  hasImitations = false;

  constructor(
    private theThingAccessService: TheThingAccessService,
    private authenticateService: AuthenticateService,
    private router: Router,
    private dialog: YggDialogService // private imitationAccessService: TheThingImitationAccessService
  ) {
    this.myThings$ = combineLatest([
      this.authenticateService.currentUser$,
      this.filter$
    ]).pipe(
      switchMap(([user, filter]) => {
        if (user) {
          if (!filter) {
            filter = new TheThingFilter();
          }
          filter.ownerId = user.id;
          return this.theThingAccessService.listByFilter$(filter);
        } else {
          alert('找不到登入用戶，尚未登入？');
          return of([]);
        }
      })
    );
    // this.subscriptions.push(
    //   this.imitationAccessService.list$().subscribe(imitations => {
    //     this.imitations = imitations;
    //     this.hasImitations = !isEmpty(this.imitations);
    //   })
    // );
  }

  ngOnInit() {}

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  // onClickTheThing(theThing: TheThing) {
  //   if (theThing) {
  //     this.router.navigate(['/the-things', theThing.id]);
  //   }
  // }

  onFilterChanged(filter: TheThingFilter) {
    this.filter$.next(filter);
  }

  addTheThing() {
    this.router.navigate(['/', 'the-things', 'create']);
  }

  // async onDeleteTheThing(thing: TheThing) {
  //   if (confirm(`確定要刪除 ${thing.name} ？`)) {
  //     try {
  //       await this.theThingAccessService.delete(thing);
  //       alert(`已刪除 ${thing.name}`);
  //     } catch (error) {
  //       alert(`刪除失敗，錯誤原因： ${error.message}`);
  //     }
  //   }
  // }

  onSelectChange(selection: TheThing[]) {
    this.selection = isEmpty(selection) ? [] : selection;
  }

  applyImitation() {
    const dialogRef = this.dialog.open(ImageThumbnailListComponent, {
      title: '選取範本並套用',
      data: {
        items: this.imitations,
        singleSelect: true
      }
    });
    return dialogRef
      .afterClosed()
      .subscribe(async (imitation: TheThingImitation) => {
        if (imitation && !isEmpty(this.selection)) {
          const selectionNames = this.selection
            .map(select => select.name)
            .join('，');
          const confirmMessage = `以下東東將套用範本 ${imitation.name}，資料將會改變\n${selectionNames}\n是否繼續？`;
          if (confirm(confirmMessage)) {
            const promises: Promise<TheThing>[] = [];
            this.selection.forEach(select => {
              select.imitate(imitation.createTheThing());
              promises.push(this.theThingAccessService.upsert(select));
            });
            try {
              await Promise.all(promises);
              alert(`${selectionNames}\n套用範本 ${imitation.name} 完成。`);
            } catch (error) {
              alert(`套用範本失敗，錯誤原因：${error.message}`);
            }
          }
        }
      });
  }

  async onDeleteSelection() {
    const confirmMessage = `確定要刪除以下物件？\n ${this.selection
      .map(s => s.name)
      .join('\n')}`;
    if (confirm(confirmMessage)) {
      try {
        await this.theThingAccessService.delete(this.selection);
        alert(`已刪除完成`);
      } catch (error) {
        alert(`刪除失敗，錯誤原因：${error.message}`);
      }
    }
  }
}
