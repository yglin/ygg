import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheThingStateComponent } from './the-thing-state.component';

describe('TheThingStateComponent', () => {
  let component: TheThingStateComponent;
  let fixture: ComponentFixture<TheThingStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheThingStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheThingStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
