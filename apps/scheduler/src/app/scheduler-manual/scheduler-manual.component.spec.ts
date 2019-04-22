import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerManualComponent } from './scheduler-manual.component';

describe('SchedulerManualComponent', () => {
  let component: SchedulerManualComponent;
  let fixture: ComponentFixture<SchedulerManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerManualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
