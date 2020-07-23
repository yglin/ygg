import { Component, OnInit, ViewChild, Inject } from '@angular/core';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import * as moment from 'moment';
// import { Event } from "@fullcalendar/core";
// import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
// import dayGridPlugin from "@fullcalendar/daygrid";
// import momentPlugin from "@fullcalendar/moment";
// import { CalendarComponent } from 'ng-fullcalendar';
// import { Options as FCOptions } from "fullcalendar";

@Component({
  selector: 'ygg-my-calendar',
  templateUrl: './my-calendar.component.html',
  styleUrls: ['./my-calendar.component.css']
})
export class MyCalendarComponent implements OnInit {
  // @ViewChild('calendar') fullCalendar: FullCalendarComponent;
  calendarOptions: any;
  // // fcEvents: EventObject[] = [];
  // // businessHours: FcBusinessHours;
  // title = '行事曆';
  // subtitle = '';

  constructor() {
    // this.calendarOptions = this.initFullCalendarOptions();
  }

  ngOnInit() {
    // this.reload();
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

  initFullCalendarOptions(): any {
    return {
      locale: 'zh-tw',
      height: () => {
        return window.innerHeight * 0.75;
      },
      defaultView: 'agendaWeek',
      nowIndicator: false,
      scrollTime: '08:00',
      eventColor: '#379965'
    };
  }

  // // onClickEvent(event: EventObject, jsEvent: MouseEvent, view: ViewObject) {
  // //   window.open(`/events/${event.id}`, 'deep-travel-event');
  // // }
}
