import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipsControlComponent } from './chips-control.component';

describe('ChipsControlComponent', () => {
  let component: ChipsControlComponent;
  let fixture: ComponentFixture<ChipsControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChipsControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipsControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
