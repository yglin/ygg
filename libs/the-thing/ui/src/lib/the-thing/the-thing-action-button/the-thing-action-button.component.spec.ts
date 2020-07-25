import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheThingActionButtonComponent } from './the-thing-action-button.component';

describe('TheThingActionButtonComponent', () => {
  let component: TheThingActionButtonComponent;
  let fixture: ComponentFixture<TheThingActionButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheThingActionButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheThingActionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
