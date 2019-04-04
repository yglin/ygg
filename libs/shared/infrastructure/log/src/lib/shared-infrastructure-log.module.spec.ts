import { async, TestBed } from '@angular/core/testing';
import { SharedInfrastructureLogModule } from './shared-infrastructure-log.module';

describe('SharedInfrastructureLogModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedInfrastructureLogModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedInfrastructureLogModule).toBeDefined();
  });
});
