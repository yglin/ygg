import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionBarredComponent } from './action-barred.component';

describe('ActionBarredComponent', () => {
  let component: ActionBarredComponent;
  let fixture: ComponentFixture<ActionBarredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionBarredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionBarredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
