import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Box, ProvisionType, Treasure, TreasureFilter } from '@ygg/ourbox/core';
import {
  GeoBound,
  GeoPoint,
  getUserLocation,
  MapView
} from '@ygg/shared/geography/core';
import { EmceeService } from '@ygg/shared/ui/widgets';
import { flatten, get, isEmpty, uniqBy, values } from 'lodash';
import { combineLatest, Subject, Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { BoxAgentService } from '../box/box-agent.service';
import { BoxFinderService } from '../box/box-finder.service';

const defaultMapView = {
  center: new GeoPoint({ latitude: 23.6978, longitude: 120.9605 }),
  zoom: 8
};

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
  tagsSubject = { collection: Treasure.collection };
  provisions = Treasure.provisionTypes;
  selectedProvision: ProvisionType = null;
  mapView: MapView = null;

  constructor(
    private boxFinder: BoxFinderService,
    private boxAgent: BoxAgentService,
    private formBuilder: FormBuilder,
    private emcee: EmceeService
  ) {
    this.formGroupSearch = this.formBuilder.group({
      tags: null,
      provision: 0
    });

    this.subscription.add(
      this.formGroupSearch.get('provision').valueChanges.subscribe(value => {
        if (value > 0) {
          this.selectedProvision = new ProvisionType(value);
        } else {
          this.selectedProvision = null;
        }
      })
    );

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
        if (!isEmpty(filters)) {
          const treasureFilter = new TreasureFilter(filters);
          const filteredBoxes = {};
          const filteredTreasures = {};
          // console.log(filters.tags.getTags());
          for (const box of boxes) {
            for (const treasure of box.treasures) {
              if (treasureFilter.match(treasure)) {
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

  ngOnInit(): void {
    const lastTimeView = this.getLastTimeView();
    console.log('Last time view');
    console.log(lastTimeView);
    if (lastTimeView && !isEmpty(lastTimeView)) {
      this.mapView = lastTimeView;
    } else {
      this.deriveMapView();
    }
  }

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

  onMapViewChange(view: MapView) {
    // Save view
    try {
      const treasureMapConfigs = JSON.parse(
        localStorage.getItem('treasureMap')
      );
      if (!isEmpty(treasureMapConfigs)) {
        treasureMapConfigs.lastView = view;
        localStorage.setItem('treasureMap', JSON.stringify(treasureMapConfigs));
      }
    } catch (error) {
      console.error(error);
    }
  }

  async clickOnBoxMarker(box: Box) {
    this.boxAgent.popupTreasuresInBox(box);
  }

  getLastTimeView() {
    try {
      const treasureMapConfigs = JSON.parse(
        localStorage.getItem('treasureMap')
      );
      const lastView = get(treasureMapConfigs, 'lastView', null);
      if (lastView && !isEmpty(lastView)) {
        lastView.center = new GeoPoint({
          latitude: lastView.center.latitude,
          longitude: lastView.center.longitude
        });
      }
      return lastView;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async deriveMapView() {
    const confirm = await this.emcee.confirm(
      `第一次造訪藏寶地圖嗎？是否要檢視您所在地附近的地圖？`
    );
    if (confirm) {
      const userLocation = await getUserLocation();
      this.mapView = {
        center: userLocation,
        zoom: 12
      };
    } else {
      this.mapView = defaultMapView;
    }
  }
}
