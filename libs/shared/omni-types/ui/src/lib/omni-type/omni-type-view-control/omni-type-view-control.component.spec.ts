import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmniTypeViewControlComponent } from './omni-type-view-control.component';

describe('OmniTypeViewControlComponent', () => {
  let component: OmniTypeViewControlComponent;
  let fixture: ComponentFixture<OmniTypeViewControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmniTypeViewControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmniTypeViewControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
