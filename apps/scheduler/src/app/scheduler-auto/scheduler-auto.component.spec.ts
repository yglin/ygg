import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerAutoComponent } from './scheduler-auto.component';

describe('SchedulerAutoComponent', () => {
  let component: SchedulerAutoComponent;
  let fixture: ComponentFixture<SchedulerAutoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerAutoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerAutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
