import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlViewSwitchComponent } from './control-view-switch.component';

describe('ControlViewSwitchComponent', () => {
  let component: ControlViewSwitchComponent;
  let fixture: ComponentFixture<ControlViewSwitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlViewSwitchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlViewSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
