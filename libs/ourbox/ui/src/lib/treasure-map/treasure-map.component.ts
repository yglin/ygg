import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Box, Treasure } from '@ygg/ourbox/core';
import { GeoBound } from '@ygg/shared/geography/core';
import { Tags } from '@ygg/shared/tags/core';
import { flatten, isEmpty, uniqBy, values } from 'lodash';
import { combineLatest, Subject, Subscription } from 'rxjs';
import { startWith, switchMap, tap } from 'rxjs/operators';
import { BoxAgentService } from '../box/box-agent.service';
import { BoxFinderService } from '../box/box-finder.service';
import { TreasureFinderService } from '../treasure/treasure-finder.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ourbox-treasure-map',
  templateUrl: './treasure-map.component.html',
  styleUrls: ['./treasure-map.component.css']
})
export class TreasureMapComponent implements OnInit, OnDestroy {
  filteredBoxes: Box[] = [];
  filteredTreasures: Treasure[] = [];
  // boxes: Box[] = [];
  // treasures: Treasure[] = [];
  formGroupSearch: FormGroup;
  mapBoundChange$ = new Subject<GeoBound>();
  subscription: Subscription = new Subscription();

  constructor(
    private boxFinder: BoxFinderService,
    private boxAgent: BoxAgentService,
    private formBuilder: FormBuilder
  ) {
    this.formGroupSearch = this.formBuilder.group({
      tags: null
    });

    const boxesInBound$ = this.mapBoundChange$.pipe(
      switchMap(bound => this.boxFinder.findPublicBoxesInMapBound(bound))
    );

    this.subscription.add(
      combineLatest([
        boxesInBound$,
        this.formGroupSearch.valueChanges.pipe(startWith({}))
      ]).subscribe(([boxes, filters]) => {
        // console.dir(boxes);
        // console.dir(filters);
        if (filters && Tags.isTags(filters.tags)) {
          // console.log(filters.tags.getTags());
          const filteredBoxes = {};
          const filteredTreasures = {};
          for (const box of boxes) {
            for (const treasure of box.treasures) {
              if (treasure.tags.include(filters.tags.getTags())) {
                filteredTreasures[treasure.id] = treasure;
                filteredBoxes[box.id] = box;
              }
            }
          }
          this.filteredBoxes = values(filteredBoxes);
          this.filteredTreasures = values(filteredTreasures);
        } else {
          this.filteredBoxes = boxes;
          this.filteredTreasures = uniqBy(
            flatten(boxes.map(box => box.treasures)),
            'id'
          );
        }
        // console.dir(this.filteredBoxes);
        // console.dir(this.filteredTreasures);
      })
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onMapBoundChange(bound: GeoBound) {
    this.mapBoundChange$.next(bound);
    // this.boxes = await this.boxFinder.findPublicBoxesInMapBound(bound);
    // this.treasures = uniqBy(
    //   flatten(this.boxes.map(box => box.treasures)),
    //   'id'
    // );
  }

  async clickOnBoxMarker(box: Box) {
    this.boxAgent.popupTreasuresInBox(box);
  }
}
