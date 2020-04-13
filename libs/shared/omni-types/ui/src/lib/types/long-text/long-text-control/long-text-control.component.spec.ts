import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LongTextControlComponent } from './long-text-control.component';

describe('LongTextControlComponent', () => {
  let component: LongTextControlComponent;
  let fixture: ComponentFixture<LongTextControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LongTextControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LongTextControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
