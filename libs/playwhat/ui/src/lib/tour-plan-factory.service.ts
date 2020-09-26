import { Injectable, OnDestroy } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import {
  ImitationEvent,
  ImitationTourPlan,
  RelationshipScheduleEvent,
  RelationshipOrganizer,
  ImitationTourPlanCellDefines,
  ImitationPlay,
  RelationshipEventService,
  ImitationEventCellDefines
} from '@ygg/playwhat/core';
import { Schedule, ServiceEvent, ScheduleFactory } from '@ygg/schedule/core';
import { ScheduleFactoryService } from '@ygg/schedule/ui';
import { EmceeService } from '@ygg/shared/ui/widgets';
import {
  Purchase,
  RelationPurchase,
  ShoppingCellDefines
} from '@ygg/shopping/core';
import { CartSubmitPack, ShoppingCartService } from '@ygg/shopping/ui';
import {
  TheThing,
  TheThingAction,
  TheThingRelation,
  RelationRecord
} from '@ygg/the-thing/core';
import {
  TheThingAccessService,
  TheThingFactoryService,
  RelationFactoryService
} from '@ygg/the-thing/ui';
import { Observable, Subscription, of } from 'rxjs';
import { EventFactoryService } from './event-factory.service';
import { ScheduleAdapterService } from './schedule-adapter.service';
import { User } from '@ygg/shared/user/core';
import { UserService } from '@ygg/shared/user/ui';
import { DateRange, TimeRange } from '@ygg/shared/omni-types/core';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { isEmpty, find } from 'lodash';

export interface IModifyRequest {
  command: 'update' | 'add' | 'delete';
  target: 'meta' | 'cell';
  field: string;
  value?: any;
  emit?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TourPlanFactoryService implements OnDestroy, Resolve<TheThing> {
  tourPlan$: Observable<TheThing>;
  // tourPlan: TheThing;
  // createInProgress: TheThing;
  subscriptions: Subscription[] = [];

  constructor(
    private theThingAccessor: TheThingAccessService,
    private theThingFactory: TheThingFactoryService,
    private shoppingCart: ShoppingCartService,
    private emcee: EmceeService,
    private router: Router,
    private scheduleAdapter: ScheduleAdapterService,
    private scheduleFactory: ScheduleFactoryService,
    private eventFactory: EventFactoryService,
    private relationFactory: RelationFactoryService
  ) {
    this.subscriptions.push(
      this.theThingFactory.runAction$.subscribe(actionSubmit => {
        for (const actionId in ImitationTourPlan.actions) {
          if (ImitationTourPlan.actions.hasOwnProperty(actionId)) {
            const action = ImitationTourPlan.actions[actionId];
            if (actionSubmit.action.id === action.id) {
              this.runAction(action, actionSubmit.theThing);
            }
          }
        }
      })
    );
    // this.subscriptions.push(
    //   this.theThingFactory.onSave$.subscribe(savedThing => {
    //     if (savedThing && this.tourPlan && savedThing.id === this.tourPlan.id) {
    //       this.tourPlan = savedThing;
    //       this.tourPlan$.next(this.tourPlan);
    //     }
    //   })
    // );
    // console.info('Subscribe to Shopping cart~!!!');
    this.subscriptions.push(
      this.shoppingCart.submit$.subscribe(
        async (cartSubmit: CartSubmitPack) => {
          let tourPlan;
          if (!!cartSubmit.order) {
            tourPlan = cartSubmit.order;
          } else {
            tourPlan = await this.theThingFactory.create(ImitationTourPlan);
          }
          tourPlan.setRelation(
            RelationPurchase.name,
            cartSubmit.purchases.map(p => p.toRelation())
          );
          this.router.navigate(['/', ImitationTourPlan.routePath, tourPlan.id]);
        }
      )
    );
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return new Promise(async (resolve, reject) => {
      try {
        const id = route.paramMap.get('id');
        if (id === 'create') {
          const newTourPlan = await this.theThingFactory.create(
            ImitationTourPlan
          );
          this.router.navigate([
            '/',
            ImitationTourPlan.routePath,
            newTourPlan.id
          ]);
          // this.tourPlan$.next(newTourPlan);
          resolve(newTourPlan);
        } else if (!!id) {
          const tourPlan = await this.theThingFactory.load(
            id,
            ImitationTourPlan.collection
          );
          this.tourPlan$ = this.theThingFactory.load$(id);
          // this.tourPlan$.next(tourPlan);
          resolve(tourPlan);
        } else reject(new Error(`Require id in route path, got ${id}`));
      } catch (error) {
        console.error(error);
        this.emcee.error(`導向 ${route.url} 失敗，錯誤原因：${error.message}`);
        reject(error);
      }
    });
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  alterShoppingCart(tourPlan: TheThing) {
    const purchases = tourPlan
      .getRelations(RelationPurchase.name)
      .map(r => Purchase.fromRelation(r));
    this.shoppingCart.import(tourPlan, purchases);
  }

  // async load(id: string): Promise<TheThing> {
  //   return this.load$(id)
  //     .pipe(take(1))
  //     .toPromise();
  // }

  // load$(id: string): Observable<TheThing> {
  //   return this.theThingFactory
  //     .load$(id)
  //     .pipe(tap(tourPlan => (this.tourPlan = tourPlan)));
  // }

  // async loadTheOne(): Promise<Observable<TheThing>> {
  //   // console.log('loadTheOne!!!');
  //   // console.log(this.tourPlan);
  //   if (!!this.tourPlan) {
  //     this.tourPlan$.next(this.tourPlan);
  //     return this.tourPlan$;
  //   } else {
  //     return this.create();
  //   }
  // }

  // async create(): Promise<Observable<TheThing>> {
  //   // console.log('Create tour-plan');
  //   // console.log(this.createInProgress);
  //   if (!this.createInProgress) {
  //     this.createInProgress = await this.theThingFactory.create({
  //       imitationId: ImitationTourPlan.id
  //     });
  //   }
  //   this.tourPlan = this.createInProgress;
  //   this.tourPlan$.next(this.tourPlan);
  //   return this.tourPlan$;
  // }

  // modify(request: IModifyRequest) {
  //   if (!this.tourPlan) {
  //     console.error(`The one tour-plan not exists`);
  //     return;
  //   }
  //   switch (request.target) {
  //     case 'meta':
  //       set(this.tourPlan, request.field, request.value);
  //       break;
  //     case 'cell':
  //       if (request.command === 'update') {
  //         if (this.tourPlan.hasCell(request.field)) {
  //           this.tourPlan.updateCellValue(request.field, request.value);
  //         }
  //       } else if (request.command === 'add') {
  //         this.tourPlan.addCell(request.value);
  //       } else if (request.command === 'delete') {
  //         this.tourPlan.deleteCell(request.field);
  //       }
  //       break;
  //     default:
  //       break;
  //   }
  //   // if (
  //   //   !this.tourPlan.name &&
  //   //   request.command === 'update' &&
  //   //   request.target === 'cell' &&
  //   //   request.field === CellIds.dateRange
  //   // ) {
  //   //   const dateRange = this.tourPlan.getCellValue(CellIds.dateRange);
  //   //   if (!!dateRange && !this.tourPlan.name) {
  //   //     this.tourPlan.name = defaultTourPlanName(dateRange);
  //   //   }
  //   //   this.tourPlan$.next(this.tourPlan);
  //   // }
  //   if (request.emit) {
  //     this.tourPlan$.next(this.tourPlan);
  //   }
  // }

  // async setState(state: TheThingState) {
  //   const confirm = await this.emcee.confirm(
  //     `要將 ${this.tourPlan.name} 的狀態設為 ${state.label}？`
  //   );
  //   if (confirm) {
  //     ImitationTourPlan.setState(this.tourPlan, state);
  //     await this.theThingFactory.save(this.tourPlan);
  //     this.tourPlan$.next(this.tourPlan);
  //   }
  // }

  // async save() {
  //   const confirm = await this.emcee.confirm(
  //     `確定要儲存 ${this.tourPlan.name} ？`
  //   );
  //   if (!confirm) {
  //     return;
  //   }
  //   await this.theThingFactory.save(this.tourPlan, {
  //     requireOwner: true
  //   });
  //   if (
  //     ImitationTourPlan.isState(this.tourPlan, ImitationTourPlan.states.new)
  //   ) {
  //     const confirm = await this.emcee.confirm(`順便將遊程計畫送出申請？`);
  //     if (confirm) {
  //       this.tourPlan.setState(
  //         ImitationTourPlan.stateName,
  //         ImitationTourPlan.states.applied
  //       );
  //       await this.theThingFactory.save(this.tourPlan, {
  //         requireOwner: true
  //       });
  //     }
  //   }
  //   await this.emcee.alert(`已成功儲存 ${this.tourPlan.name}`, AlertType.Info);
  //   // this.tourPlan = undefined;
  //   if (
  //     !!this.createInProgress &&
  //     this.tourPlan.id === this.createInProgress.id
  //   ) {
  //     this.createInProgress = undefined;
  //   }
  //   this.router.navigate(['/', ImitationTourPlan.routePath, this.tourPlan.id]);
  //   return;
  // }

  async sendApplication(tourPlan: TheThing) {
    const confirm = await this.emcee.confirm(
      `將此遊程 ${tourPlan.name} 送出申請？一旦送出便無法再修改資料`
    );
    if (confirm) {
      await this.theThingFactory.setState(
        tourPlan,
        ImitationTourPlan,
        ImitationTourPlan.states.applied
      );
      await this.emcee.info(
        `遊程 ${tourPlan.name} 已送出申請，等待管理者審核。`
      );
    }
  }

  async cancelApplication(tourPlan: TheThing) {
    const confirm = await this.emcee.confirm(
      `取消此遊程 ${tourPlan.name} 的申請並退回修改狀態？`
    );
    if (confirm) {
      await this.theThingFactory.setState(
        tourPlan,
        ImitationTourPlan,
        ImitationTourPlan.states.editing
      );
      this.emcee.info(`遊程 ${tourPlan.name} 已取消申請並退回修改`);
    }
  }

  async approveAvailable(tourPlan: TheThing) {
    const confirm = await this.emcee.confirm(
      `<h3>請確定遊程 ${tourPlan.name} 中各行程的負責人已確認該負責行程可成行，</h3><h3>將標記遊程 ${tourPlan.name} 為可成行並等待付款？</h3>`
    );
    if (confirm) {
      await this.theThingFactory.setState(
        tourPlan,
        ImitationTourPlan,
        ImitationTourPlan.states.approved
      );
      await this.emcee.info(
        `<h3>遊程 ${tourPlan.name} 已標記為可成行。</h3><h3>請通知客戶付款。</h3>`
      );
    }
  }

  async confirmPaid(tourPlan: TheThing) {
    const confirm = await this.emcee.confirm(
      `<h3>確定此遊程 ${tourPlan.name} 的所有款項已付清，標記為已付款？</h3>`
    );
    if (confirm) {
      await this.theThingFactory.setState(
        tourPlan,
        ImitationTourPlan,
        ImitationTourPlan.states.paid
      );
      await this.emcee.info(`<h3>遊程 ${tourPlan.name} 標記為已付款。</h3>`);
    }
  }

  async confirmCompleted(tourPlan: TheThing) {
    const confirm = await this.emcee.confirm(
      `<h3>確定此遊程 ${tourPlan.name} 的所有活動行程已結束，標記為已完成？</h3>`
    );
    if (confirm) {
      await this.theThingFactory.setState(
        tourPlan,
        ImitationTourPlan,
        ImitationTourPlan.states.completed
      );
      await this.emcee.info(`<h3>遊程 ${tourPlan.name} 標記為已完成。</h3>`);
    }
  }

  async listScheduledEvents(tourPlan: TheThing): Promise<TheThing[]> {
    return this.relationFactory
      .findBySubjectAndRole$(tourPlan.id, RelationshipScheduleEvent.name)
      .pipe(
        switchMap((relations: RelationRecord[]) => {
          if (isEmpty(relations)) {
            return of([]);
          } else {
            return this.theThingAccessor.listByIds$(
              relations.map(r => r.objectId),
              ImitationEvent.collection
            );
          }
        }),
        // tap(events => console.log(events)),
        map((events: TheThing[]) =>
          events.filter(ev => ImitationEvent.isValid(ev))
        ),
        // tap(events => console.log(events)),
        take(1)
      )
      .toPromise();
  }

  async listPurchasedPlays(tourPlan: TheThing): Promise<TheThing[]> {
    return this.relationFactory
      .findBySubjectAndRole$(tourPlan.id, RelationPurchase.name)
      .pipe(
        switchMap((relations: RelationRecord[]) => {
          // console.log(relations);
          if (isEmpty(relations)) {
            return of([]);
          } else {
            return this.theThingAccessor.listByIds$(
              relations.map(r => r.objectId),
              ImitationPlay.collection
            );
          }
        }),
        // tap(plays => console.log(plays)),
        map((plays: TheThing[]) => plays.filter(p => ImitationPlay.isValid(p))),
        // tap(plays => console.log(plays)),
        take(1)
      )
      .toPromise();
  }

  async schedule(tourPlan: TheThing) {
    try {
      const plays: TheThing[] = await this.listPurchasedPlays(tourPlan);
      const tEvents: TheThing[] = await this.listScheduledEvents(tourPlan);
      for (const play of plays) {
        if (
          !find(tEvents, ev =>
            ev.hasRelationTo(RelationshipEventService.name, play.id)
          )
        ) {
          const purchase: TheThingRelation = tourPlan.getRelation(
            RelationPurchase.name,
            play.id
          );
          if (purchase) {
            const newEvent: TheThing = await this.eventFactory.createFromService(
              play,
              {
                numParticipants: purchase.getCellValue(
                  ShoppingCellDefines.quantity.id
                )
              }
            );
            // console.log(newEvent);
            if (newEvent) {
              tEvents.push(newEvent);
            }
          }
        }
      }

      const inSchedule = await this.scheduleAdapter.fromTourPlanToSchedule(
        tourPlan,
        plays,
        tEvents
      );
      const outSchedule = await this.scheduleFactory.edit(inSchedule);
      if (outSchedule !== ScheduleFactory.signalCancel) {
        await this.saveScheduleForTourPlan(
          tourPlan,
          outSchedule as Schedule,
          tEvents
        );
      }
      // console.log(outSchedule);
      this.router.navigate(['/', ImitationTourPlan.routePath, tourPlan.id]);
    } catch (error) {
      this.emcee.error(`排定行程表失敗，錯誤原因：${error.message}`);
      return Promise.reject();
    }
  }

  async saveScheduleForTourPlan(
    tourPlan: TheThing,
    schedule: Schedule,
    tEvents: TheThing[]
  ) {
    try {
      if (!Schedule.isSchedule(schedule)) {
        throw new Error(`Input not a valid schedule`);
      }
      this.emcee.showProgress({
        message: '儲存行程中'
      });
      for (const tEvent of tEvents) {
        const sEvent: ServiceEvent = find(
          schedule.events,
          ev => ev.id === tEvent.id
        );
        if (!sEvent) {
          continue;
        }
        const oldTimeRange: TimeRange = tEvent.getCellValue(
          ImitationEventCellDefines.timeRange.id
        );
        if (!sEvent.timeRange.isEqual(oldTimeRange)) {
          tEvent.upsertCell(
            ImitationEventCellDefines.timeRange.createCell(sEvent.timeRange)
          );

          // Save event
          await this.eventFactory.save(tEvent);
          await this.relationFactory.saveUniq(
            new RelationRecord({
              subjectCollection: tEvent.collection,
              subjectId: tEvent.id,
              objectCollection: User.collection,
              objectId: tourPlan.ownerId,
              objectRole: RelationshipOrganizer.name
            })
          );
        }
        // Attach event to tour-plan
        if (
          !tourPlan.hasRelationTo(RelationshipScheduleEvent.name, tEvent.id)
        ) {
          const relationTourPlanEvent = RelationshipScheduleEvent.createRelation(
            tourPlan.id,
            tEvent.id
          );
          tourPlan.addRelation(relationTourPlanEvent);
        }
      }

      // Save tour-plan
      await this.theThingFactory.save(tourPlan, {
        requireOwner: true,
        imitation: ImitationTourPlan,
        force: true
      });
      this.theThingFactory.emitChange(tourPlan);
    } catch (error) {
      const wrapError = new Error(
        `Failed to save schedule for tour-plan.\n${error.message}`
      );
      return Promise.reject(wrapError);
    } finally {
      this.emcee.hideProgress();
    }
  }

  async sendApprovalRequests(tourPlan: TheThing) {
    const confirm = await this.emcee.confirm(
      `<h3>將送出行程中各活動時段資訊給各活動負責人，並等待負責人確認。</h3><br><h3>等待期間無法修改行程表，請確認行程中各活動時段已安排妥善，確定送出？</h3>`
    );
    if (confirm) {
      try {
        const relations: TheThingRelation[] = tourPlan.getRelations(
          RelationshipScheduleEvent.name
        );
        for (const relation of relations) {
          const event: TheThing = await this.theThingFactory.load(
            relation.objectId,
            ImitationEvent.collection
          );
          // console.log(`Send confirmation for event ${event.name}`);
          await this.eventFactory.sendApprovalRequest(event);
          // console.log(`Confirmation for event ${event.name} sent`);
        }
        await this.theThingFactory.setState(
          tourPlan,
          ImitationTourPlan,
          ImitationTourPlan.states.waitApproval
        );
        this.emcee.info(`<h3>已送出行程確認，等待各活動負責人確認中</h3>`);
      } catch (error) {
        this.emcee.error(`送出行程確認失敗，錯誤原因：${error.message}`);
      }
    }
  }

  runAction(action: TheThingAction, tourPlan: TheThing) {
    try {
      switch (action.id) {
        case 'send-application':
          this.sendApplication(tourPlan);
          break;
        case 'cancel-application':
          this.cancelApplication(tourPlan);
          break;
        case 'approve-available':
          this.approveAvailable(tourPlan);
          break;
        case 'confirm-paid':
          this.confirmPaid(tourPlan);
          break;
        case 'confirm-completed':
          this.confirmCompleted(tourPlan);
          break;
        case 'schedule':
          this.schedule(tourPlan);
          break;
        case 'send-approval-requests':
          this.sendApprovalRequests(tourPlan);
          break;
        case 'alter-shopping-cart':
          this.alterShoppingCart(tourPlan);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
      this.emcee.error(`執行失敗，錯誤原因：${error.message}`);
    }
  }
}
