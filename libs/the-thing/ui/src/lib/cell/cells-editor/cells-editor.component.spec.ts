import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheThingCellsEditorComponent } from './cells-editor.component';

describe('CellsEditorComponent', () => {
  let component: TheThingCellsEditorComponent;
  let fixture: ComponentFixture<TheThingCellsEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheThingCellsEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheThingCellsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
