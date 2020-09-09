import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraInfoButtonComponent } from './extra-info-button.component';

describe('ExtraInfoButtonComponent', () => {
  let component: ExtraInfoButtonComponent;
  let fixture: ComponentFixture<ExtraInfoButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtraInfoButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraInfoButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
