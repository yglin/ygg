import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleDividerComponent } from './title-divider.component';

describe('TitleDividerComponent', () => {
  let component: TitleDividerComponent;
  let fixture: ComponentFixture<TitleDividerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitleDividerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleDividerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
