import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeRangeControlComponent } from './time-range-control.component';

describe('TimeRangeControlComponent', () => {
  let component: TimeRangeControlComponent;
  let fixture: ComponentFixture<TimeRangeControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeRangeControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeRangeControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
