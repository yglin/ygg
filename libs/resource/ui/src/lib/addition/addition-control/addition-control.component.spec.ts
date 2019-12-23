import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionControlComponent } from './addition-control.component';

describe('AdditionControlComponent', () => {
  let component: AdditionControlComponent;
  let fixture: ComponentFixture<AdditionControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
