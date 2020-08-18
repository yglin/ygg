import { Injectable } from '@angular/core';
import {
  EventFactory,
  ImitationEvent,
  ImitationEventCellDefines
} from '@ygg/playwhat/core';
import { TheThingAccessService } from '@ygg/the-thing/ui';
import {
  UserService,
  NotificationFactoryService,
  AuthenticateUiService
} from '@ygg/shared/user/ui';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import {
  TheThingFactoryService,
  RelationFactoryService
} from '@ygg/the-thing/ui';
import { EmceeService } from '@ygg/shared/ui/widgets';
import { TheThing } from '@ygg/the-thing/core';
import { GoogleCalendarService } from '@ygg/shared/google/apis';
import { TimeRange } from '@ygg/shared/omni-types/core';
import { base32hex } from 'rfc4648';

@Injectable({
  providedIn: 'root'
})
export class EventFactoryService extends EventFactory {
  constructor(
    theThingAccessor: TheThingAccessService,
    theThingFactory: TheThingFactoryService,
    userAccessor: UserService,
    notificationFactory: NotificationFactoryService,
    authenticator: AuthenticateUiService,
    emcee: EmceeService,
    relationFactory: RelationFactoryService,
    router: Router,
    private googleCalendar: GoogleCalendarService
  ) {
    super(
      theThingAccessor,
      theThingFactory,
      userAccessor,
      notificationFactory,
      authenticator,
      emcee,
      relationFactory,
      router
    );
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<Observable<TheThing>> {
    return new Promise(async (resolve, reject) => {
      try {
        const id = route.paramMap.get('id');
        if (!!id) {
          this.theThingFactory.imitation = ImitationEvent;
          // await this.theThingFactory.load(
          //   id,
          //   ImitationEvent.collection
          // );
          // this.event$ = this.theThingFactory.load$(id);
          // this.tourPlan$.next(tourPlan);
          resolve(this.theThingFactory.load$(id, ImitationEvent.collection));
        } else reject(new Error(`Require id in route path, got ${id}`));
      } catch (error) {
        console.error(error);
        this.emcee.error(`導向 ${route.url} 失敗，錯誤原因：${error.message}`);
        reject(error);
      }
    });
  }

  toGoogleCalendarEvent(event: TheThing): any {
    const timeRange: TimeRange = event.getCellValue(
      ImitationEventCellDefines.timeRange.id
    );
    let fuckingBase32hexEncodingShitGoogleCalendarResourceId = '';
    const charCodeArray = [];
    for (let index = 0; index < event.id.length; index++) {
      charCodeArray.push(event.id.charCodeAt(index));
    }
    fuckingBase32hexEncodingShitGoogleCalendarResourceId = base32hex.stringify(
      charCodeArray
    );
    fuckingBase32hexEncodingShitGoogleCalendarResourceId = fuckingBase32hexEncodingShitGoogleCalendarResourceId
      .replace(/=/g, '')
      .toLowerCase();
    // console.log(fuckingBase32hexEncodingShitGoogleCalendarResourceId);
    return {
      id: fuckingBase32hexEncodingShitGoogleCalendarResourceId,
      start: {
        dateTime: timeRange.start.toISOString()
      },
      end: {
        dateTime: timeRange.end.toISOString()
      },
      summary: event.name,
      description: event.name
    };
  }

  async addToGoogleCalendar(event: TheThing) {
    try {
      const confirm = await this.emcee.confirm(
        `<h3>將行程 ${event.name} 加到我的Google日曆？</h3>`
      );
      if (!confirm) {
        return;
      }
      this.emcee.showProgress({
        message: `傳送行程 ${event.name} 到Google日曆`
      });
      const gcEvent = await this.googleCalendar.insertEvent(
        this.toGoogleCalendarEvent(event)
      );
      await this.emcee.info(
        `<h3>行程 ${event.name} 已加到你的Google日曆中</h3><a href="${gcEvent.htmlLink}" target="_blank">點此檢視</a>`
      );
    } catch (error) {
      this.emcee.error(
        `<h3>行程 ${event.name} 加到Google日曆失敗，錯誤原因：${error.message}</h3>`
      );
      return Promise.reject(error);
    } finally {
      this.emcee.hideProgress();
    }
  }
}
