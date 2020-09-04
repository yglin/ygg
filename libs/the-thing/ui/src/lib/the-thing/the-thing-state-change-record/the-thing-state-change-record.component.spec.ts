import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheThingStateChangeRecordComponent } from './the-thing-state-change-record.component';

describe('TheThingStateChangeRecordComponent', () => {
  let component: TheThingStateChangeRecordComponent;
  let fixture: ComponentFixture<TheThingStateChangeRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheThingStateChangeRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheThingStateChangeRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
