import { async, TestBed } from '@angular/core/testing';
import { ShoppingCoreModule } from './shopping-core.module';

describe('ShoppingCoreModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ShoppingCoreModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ShoppingCoreModule).toBeDefined();
  });
});
