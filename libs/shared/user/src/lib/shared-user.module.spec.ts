import { async, TestBed } from '@angular/core/testing';
import { SharedUserModule } from './shared-user.module';

describe('SharedUserModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedUserModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedUserModule).toBeDefined();
  });
});
