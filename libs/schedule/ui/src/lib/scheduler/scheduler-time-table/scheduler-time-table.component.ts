import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { APP_CONFIG } from '../../../app.config';
// import { Session } from '../../../baseClasses/session';
// import { Event } from '../../../event/event';
// import { Play } from '../../../play/play';
// // import { PlayEvent } from '../../../play/play-event';
// import { PlayService } from '../../../play/play.service';
// import { CalendarService } from '../../../calendar/calendar.service';
// import { EventService } from '../../../event/event.service';
import {
  Schedule,
  ServiceEvent,
  ServiceAvailablility
} from '@ygg/schedule/core';
import { EmceeService } from '@ygg/shared/ui/widgets';
import {
  debounce,
  get,
  isEmpty,
  keyBy,
  remove,
  difference,
  extend
} from 'lodash';
import * as moment from 'moment';
import { DragulaService } from 'ng2-dragula';
import { config } from '../../config';
import { Subscription, Subject } from 'rxjs';
import { DayTime, DayTimeRange, TimeRange } from '@ygg/shared/omni-types/core';
import * as chroma from 'chroma-js';
import { ScheduleFactoryService } from '../../schedule-factory.service';

// import { MatSnackBar, MatDialog, MatDialogRef } from '@angular/material';
// import { EventEditComponent } from '../../../event/event-edit/event-edit.component';
// import { AuthenticationService } from '../../../user/authentication.service';

interface ScheduleForm {
  startDate: moment.Moment;
  endDate: moment.Moment;
  startTime: moment.Moment;
  endTime: moment.Moment;
  duration: moment.Duration;
  numParticipants: number;
}

interface TimeSlot {
  start: moment.Moment;
  events: string[];
  style?: any;
  backgroundColor?: string;
  availability?: number;
}

interface TimeTableDay {
  date: moment.Moment;
  timeSlots: TimeSlot[];
}

interface TimeTable {
  startDay: moment.Moment;
  endDay: moment.Moment;
  dayTimeRange: DayTimeRange;
  days: TimeTableDay[];
  style: any;
}

@Component({
  selector: 'ygg-scheduler-time-table',
  templateUrl: './scheduler-time-table.component.html',
  styleUrls: ['./scheduler-time-table.component.css']
})
export class SchedulerTimeTableComponent implements OnInit, OnDestroy {
  @Input() schedule: Schedule;
  events: { [id: string]: ServiceEvent } = {};
  eventPool: string[] = [];
  timeTable: TimeTable;
  onChangeEvent$: Subject<any> = new Subject();
  // availableSessionsCache: any = {};
  // errorMessages: string[] = [];
  // loadingStack = 0;
  subscriptions: Subscription[] = [];
  tableCellWidth = config.scheduler.display.halfHourLength;
  errorMessages: { [eventId: string]: string[] } = {};

  constructor(
    private emcee: EmceeService,
    private route: ActivatedRoute,
    private scheduleFactory: ScheduleFactoryService
  ) {
    this.schedule = get(this.route.snapshot.data, 'schedule', null);
    this.events = keyBy(this.schedule.events, 'id');
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  ngOnInit() {
    if (!this.schedule) {
      return;
    }

    this.assessSchedule();

    this.renderTimeTable();
  }

  renderTimeTable() {
    this.timeTable = {
      startDay: moment(this.schedule.timeRange.start).startOf('day'),
      endDay: moment(this.schedule.timeRange.end).endOf('day'),
      dayTimeRange: this.schedule.dayTimeRange.alignHalfHour(),
      days: [],
      style: {}
    };

    // const halfHourCount = Math.floor(
    //   this.timeTable.endTime.diff(this.timeTable.startTime, 'minute') / 30
    // );
    // this.timeTable.style.width = `${(config.scheduler.display.halfHourLength +
    //   2) *
    //   halfHourCount}px`;

    // console.log(this.timeTable.dayTimeRange);

    let day: TimeTableDay = {
      date: moment(this.timeTable.startDay).startOf('day'),
      timeSlots: []
    };
    this.timeTable.days.push(day);
    for (
      const timeIterator = moment(this.timeTable.startDay);
      timeIterator.isBefore(this.timeTable.endDay);
      timeIterator.add(30, 'minute')
    ) {
      if (timeIterator.diff(day.date, 'day') >= 1) {
        day = {
          date: moment(timeIterator).startOf('day'),
          timeSlots: []
        };
        this.timeTable.days.push(day);
      }
      const dayTime = DayTime.fromDate(timeIterator.toDate());
      if (this.timeTable.dayTimeRange.include(dayTime)) {
        day.timeSlots.push({
          start: moment(timeIterator),
          events: [],
          backgroundColor: chroma('white')
            .alpha(0.25)
            .css()
          // style: {
          //   width: (100 / halfHourCount).toFixed(3) + '%'
          // }
        });
      }
    }

    // Place events
    if (!isEmpty(this.events)) {
      for (const id in this.events) {
        if (this.events.hasOwnProperty(id)) {
          const event = this.events[id];
          const timeSlot = this.findInTimeSlot(event);
          if (timeSlot) {
            timeSlot.events.push(event.id);
          } else {
            this.eventPool.push(event.id);
          }
        }
      }
    }
  }

  async assessSchedule() {
    for (const event of this.schedule.events) {
      this.errorMessages[event.id] = (
        await this.scheduleFactory.assessEvent(event)
      ).map(error => error.message);
    }
  }

  async onChangeTimeSlotEvents(timeSlot: TimeSlot, eventIds: string[]) {
    try {
      const droppedEventIds = difference(eventIds, timeSlot.events);
      for (const droppedEventId of droppedEventIds) {
        const event = this.events[droppedEventId];
        event.timeRange.moveTo(timeSlot.start.toDate());
        // console.log(`${event.name} move to ${timeSlot.start.toDate()}`);
        this.errorMessages[droppedEventId] = (
          await this.scheduleFactory.assessEvent(event)
        ).map(error => error.message);
      }
      timeSlot.events = eventIds;
    } catch (error) {
      this.emcee.error(`移動事件時段失敗，錯誤原因：${error}`);
    }
  }

  // getEventsByIds(eventIds: string[]): Event[] {
  //   return eventIds.map(eventId => this.events[eventId]);
  // }

  // onDrag(args: any[]) {
  //   // let [bagName, element, source] = args;
  //   const element = args[1];
  //   const event = this.events[element.getAttribute('eventId')];
  //   this.clickEvent.emit(event);
  // }

  findInTimeSlot(event: ServiceEvent): TimeSlot {
    let resultTimeSlot: TimeSlot;
    if (event.timeRange) {
      findTimSlot: for (
        let dayIndex = 0;
        dayIndex < this.timeTable.days.length;
        dayIndex++
      ) {
        const day = this.timeTable.days[dayIndex];
        for (let timeIndex = 0; timeIndex < day.timeSlots.length; timeIndex++) {
          const timeSlot = day.timeSlots[timeIndex];
          if (
            Math.abs(
              moment(event.timeRange.start).diff(timeSlot.start, 'minute')
            ) < 30
          ) {
            resultTimeSlot = timeSlot;
            break findTimSlot;
          }
        }
      }
    }
    return resultTimeSlot;
  }

  // getLastEventEndTime(): moment.Moment {
  //   let lastEnd: moment.Moment;
  //   this.timeTable.days.forEach(day => {
  //     day.timeSlots.forEach(timeSlot => {
  //       timeSlot.events.forEach(eventId => {
  //         const event = this.events[eventId];
  //         if (!lastEnd || event.end.isAfter(lastEnd)) {
  //           lastEnd = event.end;
  //         }
  //       });
  //     });
  //   });
  //   return lastEnd;
  // }

  // tryAutoScheduleIt(event: Event): Observable<Event> {
  //   let result: Observable<Event>;
  //   if (!this.findInTimeSlot(event)) {
  //     const lastEnd = this.getLastEventEndTime();
  //     if (lastEnd) {
  //       const nextStart = moment(lastEnd).add(30, 'minute');
  //       // Check if after day end time
  //       if (
  //         moment(nextStart.format('HH:mm'), 'HH:mm').isAfter(
  //           moment(this.form.endTime.format('HH:mm'), 'HH:mm')
  //         )
  //       ) {
  //         // Jump to next day start time
  //         nextStart.add(1, 'day');
  //         nextStart
  //           .hour(this.form.startTime.hour())
  //           .minute(this.form.startTime.minute());
  //       }
  //       result = this.eventService.moveToTime(event, nextStart);
  //     } else {
  //       result = of(event);
  //     }
  //   } else {
  //     result = of(event);
  //   }
  //   this.loadingStack += 1;
  //   return result.pipe(finalize(() => (this.loadingStack -= 1)));
  // }

  // addEvent(event: Event) {
  //   this.tryAutoScheduleIt(event).subscribe(_event => {
  //     const targetTimeSlot = this.findInTimeSlot(_event);
  //     if (targetTimeSlot) {
  //       targetTimeSlot.events.push(_event.id);
  //       // _.remove(this.eventPool, id => id === _event.id);
  //     } else {
  //       this.eventPool.push(_event.id);
  //       // if (!this.eventPool.includes(_event.id)) {
  //       // }
  //     }
  //     this.events[_event.id] = _event;
  //     this.renderAvailableSessionsOnTimeTable(_event);
  //   });
  // }

  // removeEvent(event: Event) {
  //   for (let dayIndex = 0; dayIndex < this.timeTable.days.length; dayIndex++) {
  //     const day = this.timeTable.days[dayIndex];
  //     for (let timeIndex = 0; timeIndex < day.timeSlots.length; timeIndex++) {
  //       const timeSlot = day.timeSlots[timeIndex];
  //       _.remove(timeSlot.events, eventId => eventId === event.id);
  //     }
  //   }
  //   _.remove(this.events, _event => _event.id === event.id);
  //   _.remove(this.eventPool, id => id === event.id);
  //   delete this.events[event.id];
  //   this.clearAvailableSessionsOnTimeTable();
  // }

  // onDeleteEvent(event: Event) {
  //   this.removeEvent(event);
  //   this.deleteEvent.emit(event);
  // }

  onMousedownEvent(eventId: string) {
    const event = this.events[eventId];
    this.renderAvailableSessionsOnTimeTable(event);
  }

  // getAvailableSessions(event: Event): Observable<Session[]> {
  //   // let getPlay: Observable<Play>;
  //   // if (typeof play === 'string') {
  //   //   getPlay = this.playService.get(play);
  //   // } else if (play && play.id) {
  //   //   getPlay = of(play);
  //   // } else {
  //   //   return of([]);
  //   // }

  //   // return getPlay.pipe(
  //   //   switchMap(_play => {
  //   const startTime = moment(this.form.startDate).set({
  //     hour: this.form.startTime.hour(),
  //     minute: this.form.startTime.minute()
  //   });
  //   const endTime = moment(this.form.endDate).set({
  //     hour: this.form.endTime.hour(),
  //     minute: this.form.endTime.minute()
  //   });
  //   return this.calendarService.getAvailableSessions(event.id, {
  //     startTime: startTime,
  //     endTime: endTime
  //   });
  //   //   })
  //   // );
  // }

  // clearAvailableSessionsOnTimeTable() {
  //   // Reset all time slots background-colors
  //   this.timeTable.days.forEach(day => {
  //     day.timeSlots.forEach(timeSlot => {
  //       timeSlot.style['background-color'] = '#ffffff';
  //     });
  //   });
  // }

  async renderAvailableSessionsOnTimeTable(event: ServiceEvent) {
    const sa: ServiceAvailablility = this.scheduleFactory.getServiceAvailability(
      event.service.id
    );

    // console.log(event.service.businessHours);
    for (const day of this.timeTable.days) {
      for (const timeSlot of day.timeSlots) {
        const theHalfHour = new TimeRange(
          timeSlot.start.toDate(),
          moment(timeSlot.start)
            .add(30, 'minute')
            .toDate()
        );
        if (!timeSlot.style) {
          timeSlot.style = {};
        }
        // console.log(`time slot ${timeSlot.start.format('DD HH:mm')}`);
        if (sa) {
          timeSlot.availability = sa.getSingleAvailability(theHalfHour);
        } else {
          timeSlot.availability = 0;
        }

        if (timeSlot.availability > 0) {
          // console.log(`include half hour ${theHalfHour.format()}`);
          timeSlot.backgroundColor = chroma(event.service.color)
            .alpha(0.25)
            .css();
        } else {
          timeSlot.backgroundColor = chroma('white')
            .alpha(0.25)
            .css();
        }
      }
    }
  }

  // showWarning(message: string) {
  //   const snackBarRef = this.snackBar.open(message, 'X', {
  //     duration: 10000,
  //     verticalPosition: 'top'
  //   });
  //   snackBarRef.onAction().subscribe(() => {
  //     snackBarRef.dismiss();
  //   });
  // }

  // checkDuration() {
  //   const [start, end] = Event.getStartEndOfEvents(this.events);
  //   const currentDuration = moment.duration(
  //     end.endOf('day').diff(start.startOf('day'))
  //   );
  //   // const currentDurationHours = currentDuration.asHours();
  //   const currentDurationDays = currentDuration.asDays();
  //   // const formDurationHours = this.form.duration.asHours();
  //   const formDurationDays = this.form.duration.asDays();
  //   if (currentDurationDays > formDurationDays) {
  //     this.errorMessages.push(`目前規劃已超出預計時程${formDurationDays}天`);
  //   }
  // }

  // checkScheduleForm() {
  //   this.errorMessages.length = 0;
  //   this.checkDuration();
  // }

  // addNewEvent(timeSlot: any) {
  //   const newEvent = this.eventService.new();
  //   newEvent.start = moment(timeSlot.start);
  //   newEvent.end = moment(timeSlot.start).add(30, 'minute');
  //   this.createEvent.emit(newEvent);

  //   // this.authService.getCurrentUser().subscribe(user => {
  //   //   if (user && user.id) {
  //   //     newEvent.ownerId = user.id;
  //   //   }
  //   //   const dialogRef = this.dialog.open(EventEditComponent, {
  //   //     data: {
  //   //       event: newEvent,
  //   //       isNew: true
  //   //     }
  //   //   });
  //   //   dialogRef.afterClosed().subscribe(event => {
  //   //     if (event) {
  //   //       this.addEvent(event);
  //   //     }
  //   //   });
  //   // });
  // }
}
