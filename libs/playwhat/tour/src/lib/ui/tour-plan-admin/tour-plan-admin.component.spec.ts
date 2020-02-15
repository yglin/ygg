import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourPlanAdminComponent } from './tour-plan-admin.component';

describe('TourPlanAdminComponent', () => {
  let component: TourPlanAdminComponent;
  let fixture: ComponentFixture<TourPlanAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourPlanAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourPlanAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
