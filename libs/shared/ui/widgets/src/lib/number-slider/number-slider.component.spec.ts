import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberSliderComponent } from './number-slider.component';

describe('NumberSliderComponent', () => {
  let component: NumberSliderComponent;
  let fixture: ComponentFixture<NumberSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumberSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
