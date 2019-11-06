import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyScheduleDashboardComponent } from './my-schedule-dashboard.component';

describe('MyScheduleDashboardComponent', () => {
  let component: MyScheduleDashboardComponent;
  let fixture: ComponentFixture<MyScheduleDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyScheduleDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyScheduleDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
