import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheThingDataTableComponent } from './the-thing-data-table.component';

describe('TheThingDataTableComponent', () => {
  let component: TheThingDataTableComponent;
  let fixture: ComponentFixture<TheThingDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheThingDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheThingDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
