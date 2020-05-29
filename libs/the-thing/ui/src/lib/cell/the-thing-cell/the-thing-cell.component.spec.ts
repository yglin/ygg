import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheThingCellComponent } from './the-thing-cell.component';

describe('TheThingCellComponent', () => {
  let component: TheThingCellComponent;
  let fixture: ComponentFixture<TheThingCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheThingCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheThingCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
