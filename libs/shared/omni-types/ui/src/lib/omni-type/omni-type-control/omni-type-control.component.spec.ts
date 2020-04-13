import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmniTypeControlComponent } from './omni-type-control.component';

describe('OmniTypeControlComponent', () => {
  let component: OmniTypeControlComponent;
  let fixture: ComponentFixture<OmniTypeControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmniTypeControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmniTypeControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
