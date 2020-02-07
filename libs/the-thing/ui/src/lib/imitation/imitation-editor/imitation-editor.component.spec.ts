import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImitationEditorComponent } from './imitation-editor.component';

describe('ImitationEditorComponent', () => {
  let component: ImitationEditorComponent;
  let fixture: ComponentFixture<ImitationEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImitationEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImitationEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
