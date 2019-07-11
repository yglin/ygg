import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberRangeControlComponent } from './number-range-control.component';

describe('NumberRangeControlComponent', () => {
  let component: NumberRangeControlComponent;
  let fixture: ComponentFixture<NumberRangeControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumberRangeControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberRangeControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
