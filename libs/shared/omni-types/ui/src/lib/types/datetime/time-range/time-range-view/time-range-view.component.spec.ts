import * as moment from 'moment';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TimeRangeViewComponent } from './time-range-view.component';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { TimeRangeViewPageObject } from './time-range-view.component.po';
import { AngularJestTester } from '@ygg/shared/test/angular-jest';
import { TimeRange } from '@ygg/shared/omni-types/core';
import { DATE_FORMATS } from '@ygg/shared/omni-types/core';
import { Component } from '@angular/core';

describe('TimeRangeViewComponent', () => {
  let hostComponent: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let pageObject: TimeRangeViewPageObject;
  let tester: AngularJestTester;

  @Component({
    selector: 'yggtest-time-range-view-host',
    template: "<ygg-time-range-view [TimeRange]='TimeRange'></ygg-time-range-view>"
  })
  class HostComponent {
    TimeRange: TimeRange;
    constructor() { }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedUiNgMaterialModule],
      declarations: [TimeRangeViewComponent, HostComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    pageObject = new TimeRangeViewPageObject('');
    tester = new AngularJestTester({
      fixture,
      debugElement: fixture.debugElement
    });
    fixture.detectChanges();
  });

  it('should show correct data', async done => {
    const testTimeRange = TimeRange.forge();
    hostComponent.TimeRange = testTimeRange;
    await fixture.whenStable();
    fixture.detectChanges();
    await tester.expectTextContent(pageObject.getSelector('start'), moment(testTimeRange.start).format(DATE_FORMATS.display.date));
    await tester.expectTextContent(pageObject.getSelector('end'), moment(testTimeRange.end).format(DATE_FORMATS.display.date));
    done();
  });
});
