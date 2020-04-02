import { async, TestBed } from '@angular/core/testing';
import { SharedUserUiModule } from './shared-user.module';

describe('SharedUserUiModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedUserUiModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedUserUiModule).toBeDefined();
  });
});
