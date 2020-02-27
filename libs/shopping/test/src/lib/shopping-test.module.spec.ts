import { async, TestBed } from '@angular/core/testing';
import { ShoppingTestModule } from './shopping-test.module';

describe('ShoppingTestModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ShoppingTestModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ShoppingTestModule).toBeDefined();
  });
});
