import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'yggWeekDayPipe'
})
export class WeekDayPipePipe implements PipeTransform {
  weekDayNames = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  transform(value: number, ...args: any[]): string {
    return this.weekDayNames[(value % this.weekDayNames.length)];
  }

}
