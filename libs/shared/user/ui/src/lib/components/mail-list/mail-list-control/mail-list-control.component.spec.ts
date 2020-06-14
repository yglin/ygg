import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailListControlComponent } from './mail-list-control.component';

describe('MailListControlComponent', () => {
  let component: MailListControlComponent;
  let fixture: ComponentFixture<MailListControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailListControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailListControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
