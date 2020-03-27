import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenHourComponent } from './open-hour.component';
import { OpenHour } from './open-hour';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { WeekDayNames, WeekDayPipePipe } from '../../datetime';
import { DayTimeRangeComponent } from '../../datetime/day-time-range';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';

describe('OpenHourComponent', () => {
  let component: OpenHourComponent;
  let fixture: ComponentFixture<OpenHourComponent>;
  let debugElement: DebugElement;

  const weekDaySelector = '#week-day .value';
  const dayTimeRangeSelector = '.day-time-range';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedUiNgMaterialModule],
      declarations: [ OpenHourComponent, DayTimeRangeComponent, WeekDayPipePipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenHourComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should diaply open-hour', async done => {
    const testOpenHour = OpenHour.forge();
    component.openHour = testOpenHour;
    await fixture.whenStable();
    fixture.detectChanges();
    const weekDayElement: HTMLElement = debugElement.query(By.css(weekDaySelector)).nativeElement;
    const dayTimeRangeElement: HTMLElement = debugElement.query(By.css(dayTimeRangeSelector)).nativeElement;
    expect(weekDayElement.textContent).toContain(WeekDayNames[testOpenHour.weekDay]);
    const startString = testOpenHour.dayTimeRange.start.format('A HH:mm');
    const endString = testOpenHour.dayTimeRange.end.format('A HH:mm');
    const regExp: RegExp = new RegExp(`.*(${startString}).*(${endString})`);
    expect(dayTimeRangeElement.innerHTML).toMatch(regExp);
    done();
  });
});
