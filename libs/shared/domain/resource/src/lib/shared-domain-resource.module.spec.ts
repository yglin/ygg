import { async, TestBed } from '@angular/core/testing';
import { SharedDomainResourceModule } from './shared-domain-resource.module';

describe('SharedDomainResourceModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedDomainResourceModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedDomainResourceModule).toBeDefined();
  });
});
