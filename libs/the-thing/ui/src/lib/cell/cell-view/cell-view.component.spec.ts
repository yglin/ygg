import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellViewComponent } from './cell-view.component';

describe('CellViewComponent', () => {
  let component: CellViewComponent;
  let fixture: ComponentFixture<CellViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
