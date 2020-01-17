import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlControlComponent } from './html-control.component';

describe('HtmlControlComponent', () => {
  let component: HtmlControlComponent;
  let fixture: ComponentFixture<HtmlControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HtmlControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
