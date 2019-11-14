import { async, TestBed } from '@angular/core/testing';
import { ShoppingUiModule } from './shopping-ui.module';

describe('ShoppingUiModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ShoppingUiModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ShoppingUiModule).toBeDefined();
  });
});
