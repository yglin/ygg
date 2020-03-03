import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationsEditorComponent } from './relations-editor.component';

describe('RelationsEditorComponent', () => {
  let component: RelationsEditorComponent;
  let fixture: ComponentFixture<RelationsEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationsEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
