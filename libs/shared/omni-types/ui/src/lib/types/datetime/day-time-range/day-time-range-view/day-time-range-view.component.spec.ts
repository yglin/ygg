import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockModule } from "ng-mocks";
import { DayTimeRangeViewComponent } from './day-time-range-view.component';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { DayTimeRange } from '@ygg/shared/omni-types/core';
import { By } from '@angular/platform-browser';

describe('DayTimeRangeViewComponent', () => {
  let component: DayTimeRangeViewComponent;
  let fixture: ComponentFixture<DayTimeRangeViewComponent>;
  const startSelector = 'span.start';
  const endSelector = 'span.end';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedUiNgMaterialModule],
      declarations: [ DayTimeRangeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayTimeRangeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display time range', async done => {
    const testTimeRange: DayTimeRange = DayTimeRange.forge();
    component.dayTimeRange = testTimeRange;
    await fixture.whenStable();
    fixture.detectChanges();
    const startElement = fixture.debugElement.query(By.css(startSelector)).nativeElement;
    const endElement = fixture.debugElement.query(By.css(endSelector)).nativeElement;
    expect(startElement.textContent).toEqual(testTimeRange.start.format('A h:mm'));
    expect(endElement.textContent).toEqual(testTimeRange.end.format('A h:mm'));
    done();
  });
});
