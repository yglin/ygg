import { async, TestBed } from '@angular/core/testing';
import { ResourceFactoryModule } from './resource-factory.module';

describe('ResourceFactoryModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ResourceFactoryModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ResourceFactoryModule).toBeDefined();
  });
});
