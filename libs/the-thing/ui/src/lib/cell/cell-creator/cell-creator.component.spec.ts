import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellCreatorComponent } from './cell-creator.component';

describe('CellCreatorComponent', () => {
  let component: CellCreatorComponent;
  let fixture: ComponentFixture<CellCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
