import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourPlanBuilderComponent } from './tour-plan-builder.component';

describe('TourPlanBuilderComponent', () => {
  let component: TourPlanBuilderComponent;
  let fixture: ComponentFixture<TourPlanBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourPlanBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourPlanBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
