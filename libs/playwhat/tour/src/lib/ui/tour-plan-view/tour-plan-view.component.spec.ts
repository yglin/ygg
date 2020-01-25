import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourPlanViewComponent } from './tour-plan-view.component';

describe('TourPlanViewComponent', () => {
  let component: TourPlanViewComponent;
  let fixture: ComponentFixture<TourPlanViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourPlanViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourPlanViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
