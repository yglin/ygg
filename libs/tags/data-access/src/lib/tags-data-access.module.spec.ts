import { async, TestBed } from '@angular/core/testing';
import { TagsDataAccessModule } from './tags-data-access.module';

describe('TagsDataAccessModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TagsDataAccessModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(TagsDataAccessModule).toBeDefined();
  });
});
