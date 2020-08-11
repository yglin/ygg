import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeLengthControlComponent } from './time-length-control.component';

describe('TimeLengthControlComponent', () => {
  let component: TimeLengthControlComponent;
  let fixture: ComponentFixture<TimeLengthControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeLengthControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeLengthControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
