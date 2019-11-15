import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseThumbnailComponent } from './purchase-thumbnail.component';

describe('PurchaseThumbnailComponent', () => {
  let component: PurchaseThumbnailComponent;
  let fixture: ComponentFixture<PurchaseThumbnailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseThumbnailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
