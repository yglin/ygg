import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerFormViewComponent } from './scheduler-form-view.component';

describe('SchedulerFormViewComponent', () => {
  let component: SchedulerFormViewComponent;
  let fixture: ComponentFixture<SchedulerFormViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerFormViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerFormViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
