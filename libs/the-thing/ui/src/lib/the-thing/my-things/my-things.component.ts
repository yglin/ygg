import { isEmpty } from 'lodash';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  TheThing,
  TheThingFilter,
  TheThingImitation
} from '@ygg/the-thing/core';
import {
  Subscription,
  of,
  BehaviorSubject,
  combineLatest,
  Observable,
  throwError
} from 'rxjs';
import { switchMap, map, take } from 'rxjs/operators';
import {
  TheThingAccessService,
  TheThingImitationAccessService
} from '@ygg/the-thing/data-access';
import { AuthenticateService } from '@ygg/shared/user';
import { Router } from '@angular/router';
import {
  YggDialogService,
  ImageThumbnailListComponent
} from '@ygg/shared/ui/widgets';

@Component({
  selector: 'the-thing-my-things',
  templateUrl: './my-things.component.html',
  styleUrls: ['./my-things.component.css']
})
export class MyThingsComponent implements OnInit, OnDestroy {
  myThings$: Observable<TheThing[]>;
  // filter: TheThingFilter;
  filter$: BehaviorSubject<TheThingFilter> = new BehaviorSubject(null);
  filteredTheThings$: Observable<TheThing[]>;
  selection: TheThing[] = [];
  // filterChange$: BehaviorSubject<TheThingFilter> = new BehaviorSubject(new TheThingFilter());
  subscriptions: Subscription[] = [];
  imitations: TheThingImitation[] = [];
  hasImitations = false;

  constructor(
    private theThingAccessService: TheThingAccessService,
    private authenticateService: AuthenticateService,
    private router: Router,
    private dialog: YggDialogService,
    private imitationAccessService: TheThingImitationAccessService
  ) {
    this.myThings$ = this.authenticateService.currentUser$.pipe(
      switchMap(user => {
        if (user) {
          return this.theThingAccessService.listByOwner$(user.id);
        } else {
          alert('找不到登入用戶，尚未登入？');
          return of([]);
        }
      })
    );
    this.filteredTheThings$ = combineLatest([
      this.myThings$,
      this.filter$
    ]).pipe(
      map(([theThings, filter]) => {
        if (filter) {
          return (filter as TheThingFilter).filter(theThings);
        } else {
          return theThings;
        }
      })
    );

    this.subscriptions.push(
      this.imitationAccessService.list$().subscribe(imitations => {
        this.imitations = imitations;
        this.hasImitations = !isEmpty(this.imitations);
      })
    );
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

  // onFilterChanged(filter: TheThingFilter) {
  //   this.filter$.next(filter);
  // }

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

  async deleteTheThings(things: TheThing[]) {
    const confirmMessage = `確定要刪除以下物件？\n ${things
      .map(s => s.name)
      .join('\n')}`;
    if (confirmMessage) {
      try {
        for (const thing of things) {
          console.log(`Delete ${thing.name}`);
          await this.theThingAccessService.delete(thing);
        }
        alert(`已刪除完成`);
      } catch (error) {
        alert(`刪除失敗，錯誤原因：${error.message}`);
      }
    }
  }
}
