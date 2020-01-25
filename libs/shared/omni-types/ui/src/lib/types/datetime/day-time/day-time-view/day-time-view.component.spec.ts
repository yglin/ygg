import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayTimeViewComponent } from './day-time-view.component';

describe('DayTimeViewComponent', () => {
  let component: DayTimeViewComponent;
  let fixture: ComponentFixture<DayTimeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayTimeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayTimeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
