import * as moment from 'moment';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DateRangeViewComponent } from './date-range-view.component';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { DateRangeViewPageObject } from './date-range-view.component.po';
import { AngularJestTester } from '@ygg/shared/test/angular-jest';
import { DateRange } from '@ygg/shared/omni-types/core';
import { DATE_FORMATS } from '@ygg/shared/omni-types/core';
import { Component } from '@angular/core';

describe('DateRangeViewComponent', () => {
  let hostComponent: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let pageObject: DateRangeViewPageObject;
  let tester: AngularJestTester;

  @Component({
    selector: 'yggtest-date-range-view-host',
    template: "<ygg-date-range-view [dateRange]='dateRange'></ygg-date-range-view>"
  })
  class HostComponent {
    dateRange: DateRange;
    constructor() { }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedUiNgMaterialModule],
      declarations: [DateRangeViewComponent, HostComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    pageObject = new DateRangeViewPageObject('');
    tester = new AngularJestTester({
      fixture,
      debugElement: fixture.debugElement
    });
    fixture.detectChanges();
  });

  it('should show correct data', async done => {
    const testDateRange = DateRange.forge();
    hostComponent.dateRange = testDateRange;
    await fixture.whenStable();
    fixture.detectChanges();
    await tester.expectTextContent(pageObject.getSelector('start'), moment(testDateRange.start).format(DATE_FORMATS.display.date));
    await tester.expectTextContent(pageObject.getSelector('end'), moment(testDateRange.end).format(DATE_FORMATS.display.date));
    done();
  });
});
