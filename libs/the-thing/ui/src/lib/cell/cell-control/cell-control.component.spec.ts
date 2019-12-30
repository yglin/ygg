import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellControlComponent } from './cell-control.component';

describe('CellControlComponent', () => {
  let component: CellControlComponent;
  let fixture: ComponentFixture<CellControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
