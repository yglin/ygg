import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteHowtoComponent } from './site-howto.component';

describe('SiteHowtoComponent', () => {
  let component: SiteHowtoComponent;
  let fixture: ComponentFixture<SiteHowtoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteHowtoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteHowtoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
