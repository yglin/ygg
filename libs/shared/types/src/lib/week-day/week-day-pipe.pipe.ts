import { Pipe, PipeTransform } from '@angular/core';
import { WeekDayNames } from './week-day';

@Pipe({
  name: 'yggWeekDayPipe'
})
export class WeekDayPipePipe implements PipeTransform {
  transform(value: number, ...args: any[]): string {
    return WeekDayNames[(value % WeekDayNames.length)];
  }

}
