import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebuggingComponent } from './debugging.component';

describe('DebuggingComponent', () => {
  let component: DebuggingComponent;
  let fixture: ComponentFixture<DebuggingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebuggingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebuggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
