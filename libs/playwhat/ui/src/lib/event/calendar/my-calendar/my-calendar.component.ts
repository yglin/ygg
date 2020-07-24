import { Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { EventFactoryService } from '../../../event-factory.service';
import { tap } from 'rxjs/operators';
import { TheThing } from '@ygg/the-thing/core';
import { Subscription, merge } from 'rxjs';
import { ImitationEvent, ImitationEventCellDefines } from '@ygg/playwhat/core';
import { TimeRange } from '@ygg/shared/omni-types/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import * as moment from 'moment';
// import { Event } from "@fullcalendar/core";
// import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
// import dayGridPlugin from "@fullcalendar/daygrid";
// import momentPlugin from "@fullcalendar/moment";
// import { CalendarComponent } from 'ng-fullcalendar';
// import { Options as FCOptions } from "fullcalendar";

const colorsByState: { [stateName: string]: any } = {};
colorsByState[ImitationEvent.states.new.name] = {
  primary: '#99999',
  secondary: '#cccccc'
};
colorsByState[ImitationEvent.states['wait-approval'].name] = {
  primary: '#e3bc08',
  secondary: '#FDF1BA'
};
colorsByState[ImitationEvent.states['host-approved'].name] = {
  primary: '#1eff90',
  secondary: '#9dffb0'
};

function TheThing2CalendarEvent(event: TheThing): CalendarEvent {
  const timeRange: TimeRange = event.getCellValue(
    ImitationEventCellDefines.timeRange.name
  );
  const calendarEvent: CalendarEvent = {
    id: event.id,
    start: timeRange.start,
    end: timeRange.end,
    title: event.name,
    color: colorsByState[ImitationEvent.getState(event).name]
  };
  return calendarEvent;
}

@Component({
  selector: 'ygg-my-calendar',
  templateUrl: './my-calendar.component.html',
  styleUrls: ['./my-calendar.component.css']
})
export class MyCalendarComponent implements OnInit, OnDestroy {
  // @ViewChild('calendar') fullCalendar: FullCalendarComponent;
  calendarViews = CalendarView;
  view: CalendarView = CalendarView.Week;
  viewDate: Date;
  events: CalendarEvent[] = [];
  subscription: Subscription = new Subscription();
  locale = 'zh-hant';
  formControlViewDate: FormControl;
  // // fcEvents: EventObject[] = [];
  // // businessHours: FcBusinessHours;
  // title = '行事曆';
  // subtitle = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventFactory: EventFactoryService
  ) {
    const viewDate = parseInt(
      this.route.snapshot.queryParamMap.get('date'),
      10
    );
    if (viewDate) {
      this.viewDate = new Date(viewDate);
    } else {
      this.viewDate = new Date();
    }
    this.formControlViewDate = new FormControl(this.viewDate);
    const viewDate$ = this.formControlViewDate.valueChanges.pipe(
      tap(value => {
        if (moment.isMoment(value)) {
          this.viewDate = value.toDate();
        } else if (value instanceof Date) {
          this.viewDate = value;
        } else if (typeof value === 'string' && moment(value).isValid()) {
          this.viewDate = moment(value).toDate();
        }
      })
    );

    const events$ = this.eventFactory
      .listMyHostEvents$()
      .pipe(
        tap(
          (events: TheThing[]) =>
            (this.events = events.map(ev => TheThing2CalendarEvent(ev)))
        )
      );

    this.subscription.add(merge(events$, viewDate$).subscribe());
    // this.calendarOptions = this.initFullCalendarOptions();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    // this.reload();
  }

  onClickEvent({ event }: { event: CalendarEvent }) {
    this.router.navigate(['/', ImitationEvent.routePath, event.id]);
  }

  // // reload() {
  // //   if (!this.user && this.dialogData && this.dialogData.user) {
  // //     this.user = this.dialogData.user;
  // //   }
  // //   if (this.user) {
  // //     this.title = this.user.name + '的行事曆';
  // //     if (this.user.businessHours) {
  // //       setBusinessHoursEvents(this.fcEvents, this.user.businessHours);
  // //     }
  // //   } else if (this.dialogData) {
  // //     if (!_.isEmpty(this.dialogData.events)) {
  // //       this.fcEvents = toFullCalendarEvents(this.dialogData.events);
  // //     }
  // //     if (this.dialogData.businessHours) {
  // //       setBusinessHoursEvents(this.fcEvents, this.dialogData.businessHours);
  // //     }
  // //   }
  // //   this.dialogRef.afterOpen().subscribe(dialogRef => {
  // //     this.initFullCalendar();
  // //   });
  // // }
  // // onClickEvent(event: EventObject, jsEvent: MouseEvent, view: ViewObject) {
  // //   window.open(`/events/${event.id}`, 'deep-travel-event');
  // // }
}
