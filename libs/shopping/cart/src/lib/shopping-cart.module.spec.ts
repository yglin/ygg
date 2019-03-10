import { async, TestBed } from '@angular/core/testing';
import { ShoppingCartModule } from './shopping-cart.module';

describe('ShoppingCartModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ShoppingCartModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ShoppingCartModule).toBeDefined();
  });
});
