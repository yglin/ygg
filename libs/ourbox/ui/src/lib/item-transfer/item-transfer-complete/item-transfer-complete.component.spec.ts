import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTransferCompleteComponent } from './item-transfer-complete.component';

describe('ItemTransferCompleteComponent', () => {
  let component: ItemTransferCompleteComponent;
  let fixture: ComponentFixture<ItemTransferCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemTransferCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemTransferCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
