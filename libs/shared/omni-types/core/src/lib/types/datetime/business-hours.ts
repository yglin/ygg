import { isArray, isEmpty, random } from 'lodash';
import { SerializableJSON, toJSONDeep } from '@ygg/shared/infra/data-access';
import { OpenHour } from './open-hour';
import { WeekDay } from './week-day';

export class BusinessHours implements SerializableJSON {
  private openHours: OpenHour[] = [];

  static isBusinessHours(value: any): value is BusinessHours {
    return !!(value && isArray(value.openHours));
  }

  static forge(): BusinessHours {
    const newOne = new BusinessHours();
    const countOpenHours = random(5, 10);
    let count = 0;
    while (count < countOpenHours) {
      newOne.addOpenHour(OpenHour.forge());
      count++;
    }
    return newOne;
  }

  constructor() {}

  clear() {
    this.openHours.length = 0;
  }

  addOpenHour(newOpenHour: OpenHour) {
    // console.log('new open-hour');
    // console.dir(newOpenHour);
    if (isEmpty(this.openHours)) {
      this.openHours.push(newOpenHour);
    } else {
      let mergedOpenHour: OpenHour;
      let mergedHappenIndex = -1;
      let insertAtIndex = 0;
      let mergedCount = 0;
      for (let index = 0; index < this.openHours.length; index++) {
        const openHour = this.openHours[index];
        if (newOpenHour.isAfter(openHour)) {
          insertAtIndex += 1;
        }
        mergedOpenHour = newOpenHour.merge(openHour);
        if (mergedOpenHour) {
          // console.log(`Merge happen: ${mergedOpenHour.format()} + ${openHour.format()} = ${merged.format()}`);
          newOpenHour = mergedOpenHour;
          mergedCount += 1;
          if (mergedHappenIndex < 0) {
            mergedHappenIndex = index;
          }
        }
      }
      insertAtIndex =
        mergedHappenIndex >= 0 ? mergedHappenIndex : insertAtIndex;
      // console.log(`insertAtIndex = ${insertAtIndex}, mergedCount = ${mergedCount}, merged = ${mergedOpenHour.format()}`);
      this.openHours.splice(insertAtIndex, mergedCount, newOpenHour);
    }
    // console.dir(this.openHours);
  }

  removeOpenHourByIndex(index: number) {
    this.openHours.splice(index, 1);
  }

  sort() {
    this.openHours.sort((oh1, oh2) => (oh1.isAfter(oh2) ? 1 : -1));
  }

  // merge() {
  //   const result: OpenHour[] = [];
  //   let lastMerged: OpenHour = this.openHours[0];
  //   for (let index = 1; index < this.openHours.length; index++) {
  //     const openHour = this.openHours[index];
  //     const thisMerged = lastMerged.merge(openHour);
  //     if (!thisMerged) {
  //       result.push(lastMerged);
  //       lastMerged = openHour;
  //     } else {
  //       lastMerged = thisMerged;
  //     }
  //   }
  //   result.push(lastMerged);
  //   this.openHours.length = 0;
  //   this.openHours.push(...result);
  // }

  subtractOpenHour(substOpenHour: OpenHour) {
    const result: OpenHour[] = [];
    for (const openHour of this.openHours) {
      const subtracted: OpenHour[] = openHour.subtract(substOpenHour);
      result.push(...subtracted);
    }
    this.openHours.length = 0;
    this.openHours.push(...result);
  }

  getOpenHours(): OpenHour[] {
    return this.openHours;
  }

  getOpenHoursByWeekday(day: WeekDay): OpenHour[] {
    const result: OpenHour[] = [];
    for (const openHour of this.openHours) {
      if (openHour.weekDay === day) {
        result.push(openHour);
      }
    }
    return result;
  }

  fromJSON(data: any): this {
    if (data && isArray(data.openHours)) {
      this.openHours = data.openHours.map(openHour =>
        new OpenHour().fromJSON(openHour)
      );
    }
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }

  // hasValue(): boolean {
  //   if (_.isEmpty(this.value)) {
  //     return false;
  //   } else {
  //     for (let index = 0; index < this.value.length; index++) {
  //       if (this.value[index]) {
  //         return true;
  //       }
  //     }
  //     return false;
  //   }
  // }

  // clear() {
  //   if (!_.isEmpty(this.value)) {
  //     for (let index = 0; index < this.value.length; index++) {
  //       this.value[index] = false;
  //     }
  //   }
  // }

  // setOpenHours(start: moment.Moment, end: moment.Moment) {
  //   const startIndex = start.day() * 48 + start.hour() * 2 + Math.floor(start.minute() / 30);
  //   const endIndex = end.day() * 48 + end.hour() * 2 + Math.floor(end.minute() / 30);
  //   _.fill(this.value, true, startIndex, endIndex);
  // }

  // toggleOpenHours(start: moment.Moment, end: moment.Moment) {
  //   const startIndex = start.day() * 48 + start.hour() * 2 + Math.floor(start.minute() / 30);
  //   const endIndex = end.day() * 48 + end.hour() * 2 + Math.floor(end.minute() / 30);
  //   for (let index = startIndex; index < endIndex; index++) {
  //     this.value[index] = !this.value[index];
  //   }
  // }

  // getOpenHours(): any[] {
  //   const results = [];
  //   let startCursor = -1;
  //   // let endCursor = -1;
  //   for (let index = 0; index < this.value.length; index++) {
  //     if (startCursor === -1 && this.value[index]) {
  //       startCursor = index;
  //     } else if (startCursor >= 0 && (!this.value[index] || (index % 48) === 0)) {
  //       // Got a business hours interval
  //       results.push({
  //         day: Math.floor(startCursor / 48),
  //         start: {
  //           hour: Math.floor((startCursor % 48) / 2.0),
  //           minute: ((startCursor % 48) / 2.0) % 1 === 0 ? 0 : 30
  //         },
  //         end: {
  //           hour: Math.floor((index % 48) / 2.0),
  //           minute: ((index % 48) / 2.0) % 1 === 0 ? 0 : 30
  //         }
  //       });
  //       // Reset start cursor
  //       startCursor = -1;
  //     }
  //   }
  //   return results;
  // }

  // isOpen(start: moment.Moment, end: moment.Moment): boolean;
  // isOpen(dayOfWeek: number, halfHourIndex: number): boolean;
  // isOpen(arg1: any, arg2: any): boolean {
  //   if (typeof arg1 === 'number' && typeof arg2 === 'number') {
  //     const dayOfWeek = arg1;
  //     const halfHourIndex = arg2;
  //     return this.value[dayOfWeek * 48 + halfHourIndex];
  //   } else if (moment.isMoment(arg1) && moment.isMoment(arg2)) {
  //     const start = arg1;
  //     const end = arg2;
  //     let startIndex = start.day() * 48 + start.hour() * 2 + (start.minute() >= 30 ? 1 : 0);
  //     let endIndex = startIndex + Math.ceil(end.diff(start, 'minute') / 30);
  //     for (let index = startIndex; index < endIndex; index++) {
  //       if (!this.value[index % (48 * 7)]) {
  //         return false;
  //       }
  //     }
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // getAvailableSessions(start: moment.Moment, end: moment.Moment, duration?: number): Session[] {
  //   duration = duration || 2; // default duration 1 hour
  //   let startIndex = start.day() * 48 + start.hour() * 2 + (start.minute() >= 30 ? 1 : 0);
  //   let endIndex = startIndex + Math.ceil(end.diff(start, 'minute') / 30);
  //   let openTimeLength = 0;
  //   const sessions: Session[] = [];
  //   let session: any = {};
  //   for (let index = startIndex; index < endIndex; index++) {
  //     if (this.value[index % (48 * 7)]) {
  //       if (!session.start) {
  //         session.start = index;
  //       }
  //       openTimeLength += 1;
  //     }
  //     else {
  //       if (openTimeLength >= duration) {
  //         session.start = moment(start).add((session.start - startIndex) * 30, 'minute');
  //         session.end = moment(session.start).add(openTimeLength * 30, 'minute');
  //         sessions.push(session);
  //       }
  //       session = {};
  //       openTimeLength = 0;
  //     }
  //   }
  //   return sessions;
  // }
}
