import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerNewComponent } from './scheduler-new.component';

describe('SchedulerNewComponent', () => {
  let component: SchedulerNewComponent;
  let fixture: ComponentFixture<SchedulerNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
