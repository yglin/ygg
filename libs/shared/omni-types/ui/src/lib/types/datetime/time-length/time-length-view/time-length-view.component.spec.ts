import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeLengthViewComponent } from './time-length-view.component';

describe('TimeLengthViewComponent', () => {
  let component: TimeLengthViewComponent;
  let fixture: ComponentFixture<TimeLengthViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeLengthViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeLengthViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
