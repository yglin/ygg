import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyHeldItemsComponent } from './my-held-items.component';

describe('MyHeldItemsComponent', () => {
  let component: MyHeldItemsComponent;
  let fixture: ComponentFixture<MyHeldItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyHeldItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyHeldItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
