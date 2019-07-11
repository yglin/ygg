import { async, TestBed } from '@angular/core/testing';
import { SharedUiNavigationModule } from './shared-ui-navigation.module';

describe('SharedUiNavigationModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedUiNavigationModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedUiNavigationModule).toBeDefined();
  });
});
