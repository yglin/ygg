import { TestBed } from '@angular/core/testing';

import { ImitationTemplateResolver } from './imitation-template-resolver.service';

describe('ImitationTemplateResolver', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImitationTemplateResolver = TestBed.get(ImitationTemplateResolver);
    expect(service).toBeTruthy();
  });
});
