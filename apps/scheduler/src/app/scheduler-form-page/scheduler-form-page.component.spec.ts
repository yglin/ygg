import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerFormPageComponent } from './scheduler-form-page.component';

describe('SchedulerFormPageComponent', () => {
  let component: SchedulerFormPageComponent;
  let fixture: ComponentFixture<SchedulerFormPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerFormPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
