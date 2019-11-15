import { async, TestBed } from '@angular/core/testing';
import { ShoppingDataAccessModule } from './shopping-data-access.module';

describe('ShoppingDataAccessModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ShoppingDataAccessModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ShoppingDataAccessModule).toBeDefined();
  });
});
