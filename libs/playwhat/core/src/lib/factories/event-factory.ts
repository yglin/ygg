import {
  TheThing,
  TheThingAccessor,
  RelationFactory,
  TheThingFactory,
  RelationRecord,
  TheThingRelation
} from '@ygg/the-thing/core';
import {
  User,
  UserAccessor,
  NotificationFactory,
  Authenticator
} from '@ygg/shared/user/core';
import {
  RelationshipEventService,
  ImitationEvent,
  RelationshipHost,
  RelationshipOrganizer,
  ImitationEventCellDefines
} from '../imitations';
import { EmceeService } from '@ygg/shared/ui/widgets';
import { Observable, Subscription, of } from 'rxjs';
import { switchMap, shareReplay, take } from 'rxjs/operators';
import { ImitationPlay } from '../imitations';
import { Router } from '@ygg/shared/infra/core';
import { TimeRange } from '@ygg/shared/omni-types/core';

export const NotificationHostEvent = {
  type: 'host-event'
};

export class EventFactory {
  ObservableCaches: { [id: string]: Observable<any> } = {};
  subscriptions: Subscription[] = [];

  constructor(
    protected theThingAccessor: TheThingAccessor,
    protected theThingFactory: TheThingFactory,
    protected userAccessor: UserAccessor,
    protected notificationFactory: NotificationFactory,
    protected authenticator: Authenticator,
    protected emcee: EmceeService,
    protected relationFactory: RelationFactory,
    protected router: Router
  ) {
    this.subscriptions.push(
      this.theThingFactory.runAction$.subscribe(actionInfo => {
        switch (actionInfo.action.id) {
          case ImitationEvent.actions['host-approve'].id:
            this.approveAsHost(actionInfo.theThing);
            break;
          case ImitationEvent.actions['add-google-calendar'].id:
            this.addToGoogleCalendar(actionInfo.theThing);
            break;
          default:
            break;
        }
      })
    );
  }

  async createFromService(
    service: TheThing,
    options: { numParticipants?: number } = {}
  ): Promise<TheThing> {
    try {
      // console.log(`Create event from service: ${service.name}`);
      const event = ImitationEvent.createTheThing(service);
      event.name = service.name;
      if (options.numParticipants) {
        event.upsertCell(
          ImitationEventCellDefines.numParticipants.createCell(
            options.numParticipants
          )
        );
      }
      // console.log(event);
      event.addRelation(
        RelationshipEventService.createRelation(event.id, service.id)
      );
      return event;
    } catch (error) {
      const wrapError = new Error(
        `Failed to create event from service ${service.name}.\n${error.message}`
      );
      return Promise.reject(wrapError);
    }
  }

  async save(event: TheThing) {
    try {
      const play = await this.getPlay(event);
      const playOwner = await this.userAccessor.get(play.ownerId);
      await this.relationFactory.saveUniq(
        new RelationRecord({
          subjectCollection: event.collection,
          subjectId: event.id,
          objectCollection: User.collection,
          objectId: playOwner.id,
          objectRole: RelationshipHost.name
        })
      );
      return await this.theThingAccessor.upsert(event);
    } catch (error) {
      const wrapError = new Error(
        `Failed to save event ${event.id}.\n${error.message}`
      );
      return Promise.reject(wrapError);
    }
  }

  async addToGoogleCalendar(theThing: TheThing) {
    throw new Error('Method not implemented.');
  }

  async getPlay(event: TheThing) {
    try {
      return this.theThingAccessor.load(
        event.getRelations(RelationshipEventService.name)[0].objectId,
        ImitationPlay.collection
      );
    } catch (error) {
      throw new Error(`找不到行程${event.name}的體驗資料，${error.message}`);
    }
  }

  async getOrganizer(event: TheThing): Promise<User> {
    try {
      const relations = await this.relationFactory
        .findBySubjectAndRole$(event.id, RelationshipOrganizer.name)
        .pipe(take(1))
        .toPromise();
      return this.userAccessor.get(relations[0].objectId);
    } catch (error) {
      return Promise.reject(
        new Error(`找不到行程${event.name}的主辦者，${error.message}`)
      );
    }
  }

  async sendApprovalRequest(event: TheThing) {
    try {
      const play = await this.getPlay(event);
      // console.log('Hi~ MAMA');

      // const serviceId = event.getRelationObjectIds(RelationshipEventService.name)[0];
      // const service: TheThing = await this.theThingAccessor.load(serviceId);
      const host = await this.userAccessor.get(play.ownerId);
      const mailSubject = `您有一項${event.name}的行程活動邀請`;
      const mailContent = `<pre>您有一項行程活動邀請，以行程<b>${event.name}</b>的負責人身分參加</pre>`;
      await this.notificationFactory.create({
        type: NotificationHostEvent.type,
        inviterId: this.authenticator.currentUser.id,
        email: host.email,
        mailSubject,
        mailContent,
        confirmMessage: `<h3>確認以負責人身份參加行程${event.name}？</h3><div>請於行程活動頁面按下確認參加按鈕</div>`,
        landingUrl: `/${ImitationEvent.routePath}/${event.id}`,
        data: {}
      });
      await this.theThingFactory.setState(
        event,
        ImitationEvent,
        ImitationEvent.states['wait-approval'],
        { force: true }
      );
      // console.log('Hi~ PAPA');
    } catch (error) {
      const wrapError = new Error(
        `Failed to send event approval， event-id: ${event.id},\n${error.message}`
      );
      return Promise.reject(wrapError);
    }
  }

  listMyHostEvents$(): Observable<TheThing[]> {
    return this.authenticator.currentUser$.pipe(
      switchMap(user => {
        if (!user) {
          return of([]);
        } else {
          const cacheId = `my-host-events-${user.id}`;
          if (!(cacheId in this.ObservableCaches)) {
            this.ObservableCaches[
              cacheId
            ] = this.relationFactory
              .findByObjectAndRole$(user.id, RelationshipHost.name)
              .pipe(
                switchMap(relations => {
                  return this.theThingAccessor.listByIds$(
                    relations.map(r => r.subjectId),
                    ImitationEvent.collection
                  );
                }),
                shareReplay(1)
              );
          }
          return this.ObservableCaches[cacheId];
        }
      })
    );
  }

  async approveAsHost(event: TheThing) {
    try {
      const user = await this.authenticator.requestLogin();
      const organizer: User = await this.getOrganizer(event);
      const isHost = await this.relationFactory.hasRelation(
        event.id,
        user.id,
        RelationshipHost.name
      );
      if (!isHost) {
        this.emcee.error(`你不是此行程 ${event.name} 的負責人，無法核准參加`);
        return Promise.reject();
      }
      const confirm = await this.emcee.confirm(
        `<h3>確定會以負責人身份出席參加行程${event.name}？</h3>`
      );
      if (confirm) {
        await this.theThingFactory.setState(
          event,
          ImitationEvent,
          ImitationEvent.states['host-approved'],
          { force: true }
        );
        await this.emcee.info(
          `<h3>已確認參加，之後若要取消請聯絡主辦者${organizer.name}</h3>`
        );
        const calendarDate = (event.getCellValue(
          ImitationEventCellDefines.timeRange.id
        ) as TimeRange).start;
        this.router.navigate(['/', ImitationEvent.routePath, 'my'], {
          queryParams: {
            view: 'calendar',
            date: calendarDate.valueOf()
          }
        });
      }
    } catch (error) {
      this.emcee.error(`確認參加行程失敗，錯誤原因：${error.message}`);
      return Promise.reject(error);
    }
  }
}
