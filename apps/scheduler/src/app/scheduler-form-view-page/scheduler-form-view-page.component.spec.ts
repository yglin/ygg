import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerFormViewPageComponent } from './scheduler-form-view-page.component';

describe('SchedulerFormViewPageComponent', () => {
  let component: SchedulerFormViewPageComponent;
  let fixture: ComponentFixture<SchedulerFormViewPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerFormViewPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerFormViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
