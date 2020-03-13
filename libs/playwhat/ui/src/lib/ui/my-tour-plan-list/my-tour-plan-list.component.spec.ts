import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTourPlanListComponent } from './my-tour-plan-list.component';

describe('MyTourPlanListComponent', () => {
  let component: MyTourPlanListComponent;
  let fixture: ComponentFixture<MyTourPlanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyTourPlanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTourPlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
