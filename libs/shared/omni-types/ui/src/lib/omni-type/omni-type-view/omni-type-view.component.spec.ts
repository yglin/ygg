import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmniTypeViewComponent } from './omni-type-view.component';

describe('OmniTypeViewComponent', () => {
  let component: OmniTypeViewComponent;
  let fixture: ComponentFixture<OmniTypeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmniTypeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmniTypeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
