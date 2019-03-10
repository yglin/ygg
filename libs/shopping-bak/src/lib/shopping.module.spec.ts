import { async, TestBed } from '@angular/core/testing';
import { ShoppingModule } from './shopping.module';

describe('ShoppingModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ShoppingModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ShoppingModule).toBeDefined();
  });
});
