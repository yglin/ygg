import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheThingEditorComponent } from './the-thing-editor.component';

describe('TheThingEditorComponent', () => {
  let component: TheThingEditorComponent;
  let fixture: ComponentFixture<TheThingEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheThingEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheThingEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
