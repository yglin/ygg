import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellFormComponent } from './cell-form.component';

describe('CellFormComponent', () => {
  let component: CellFormComponent;
  let fixture: ComponentFixture<CellFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
