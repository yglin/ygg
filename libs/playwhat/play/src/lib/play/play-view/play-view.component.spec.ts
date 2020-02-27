import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayViewComponent } from './play-view.component';
import { SharedOmniTypesUiModule } from '@ygg/shared/omni-types/ui';
import { TagsUiModule } from '@ygg/tags/ui';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { Injectable } from '@angular/core';
import { PlayService } from '../play.service';
import { ActivatedRoute } from '@angular/router';

describe('PlayViewComponent', () => {
  @Injectable()
  class MockPlayService {}

  @Injectable()
  class MockActivatedRoute {
    snapshot = {
      paramMap: {
        get: () => null
      }
    }
  }

  let component: PlayViewComponent;
  let fixture: ComponentFixture<PlayViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlayViewComponent],
      imports: [SharedUiNgMaterialModule, SharedTypesModule, TagsUiModule],
      providers: [
        { provide: PlayService, useClass: MockPlayService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
