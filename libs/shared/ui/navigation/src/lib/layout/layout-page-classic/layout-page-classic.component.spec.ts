import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutPageClassicComponent } from './layout-page-classic.component';

describe('LayoutPageClassicComponent', () => {
  let component: LayoutPageClassicComponent;
  let fixture: ComponentFixture<LayoutPageClassicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutPageClassicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutPageClassicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
