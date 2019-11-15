import { async, TestBed } from '@angular/core/testing';
import { ShoppingFactoryModule } from './shopping-factory.module';

describe('ShoppingFactoryModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ShoppingFactoryModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ShoppingFactoryModule).toBeDefined();
  });
});
