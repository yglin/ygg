import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionBarLayoutComponent } from './action-bar-layout.component';

describe('ActionBarLayoutComponent', () => {
  let component: ActionBarLayoutComponent;
  let fixture: ComponentFixture<ActionBarLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionBarLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionBarLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
