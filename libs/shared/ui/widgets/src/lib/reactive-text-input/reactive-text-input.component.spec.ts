import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveTextInputComponent } from './reactive-text-input.component';

describe('ReactiveTextInputComponent', () => {
  let component: ReactiveTextInputComponent;
  let fixture: ComponentFixture<ReactiveTextInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReactiveTextInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactiveTextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
