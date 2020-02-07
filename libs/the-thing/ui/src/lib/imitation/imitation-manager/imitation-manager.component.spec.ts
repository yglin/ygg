import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImitationManagerComponent } from './imitation-manager.component';

describe('ImitationManagerComponent', () => {
  let component: ImitationManagerComponent;
  let fixture: ComponentFixture<ImitationManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImitationManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImitationManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
